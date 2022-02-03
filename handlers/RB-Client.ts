import fetch, { Headers } from 'node-fetch';
import ReviewBotsError from '../errors/ReviewErrors';
import { EventEmitter } from 'events';

import { ReviewInfo, Snowflake } from '../typings/types';

/**
 * DEFINE THE DEFAULT OPTIONS
 */
interface ReviewBotsOptions {
    auth?: string
}

/**
 * INITIALIZE THE CLIENT
 */
export class RBClient extends EventEmitter {

    private options: ReviewBotsOptions;

    constructor(auth: string, options: ReviewBotsOptions = {}) {

        super();

        this.options = {
            auth: auth,
            ...options
        };
    }

    /**
     * THE BASE REQUEST
     * HANDLES RESPONSE STATUSES
     */
    private async _request(method: string, path: string, body?: Record<string, any>): Promise<any> {

        const headers = new Headers();

        if (this.options.auth) headers.set('authorization', this.options.auth);
        if (method !== "GET") headers.set('Content-Type', 'application/json');

        let url = `https://api.reviewbots.xyz/${path}`;

        if (body && method === "GET") url += `${new URLSearchParams(body)}`;

        const response = await fetch(url, {
            method, headers, body: body && method !== "GET" ? JSON.stringify(body) : undefined,
        });

        let responseBody;

        if (response.headers.get('Content-Type')?.startsWith('application/json')) {
            
            responseBody = await response.json();

        } else {

            responseBody = await response.text();
        }

        if (!response.ok) {
            throw new ReviewBotsError(response.status, response.statusText, response);
        }

        return responseBody;
    }

    /**
     * GET BOT REVIEWS
     */
    public async getBotReviews(botID: Snowflake): Promise<ReviewInfo> {
        if (!botID) throw new Error(`[Review Bots API] Please provide a valid Bot ID to fetch reviews for!`);
        return this._request('GET', `rev/${botID}`);
    }

    public async getReviewInfo(botID: Snowflake, userID: Snowflake): Promise<ReviewInfo> {
        if (!botID) throw new Error(`[Review Bots API] Please provide a valid Bot ID to fetch a review for`)
        if (!userID) throw new Error(`[Review Bots API] Please provide the User ID of the person who posted the review!`);
        return this._request('GET', `rev/${botID}/${userID}`);
    }
}