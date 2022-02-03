import { Response } from "node-fetch";

const tips = {
  200: "REQUEST_SUCCESS | More Info: https://docs.reviewbots.xyz",
  400: "CLIENT_SIDE_ERROR | More Info: https://docs.reviewbots.xyz",
  401: "UNAUTHORIZED_REQUEST | More Info: https://docs.reviewbots.xyz",
  403: "REQUEST_USER_FORBIDDEN | More Info: https://docs.reviewbots.xyz",
  421: "REQUEST_RATELIMITED | More Info: https://docs.reviewbots.xyz",
  500: "INTERNAL_SERVER_ERROR | More Info: https://docs.reviewbots.xyz",
  522: "CONNECTION_TIMED_OUT | More Info: https://docs.reviewbots.xyz",
};

export default class ReviewBotsError extends Error {
  public response?: Response;
  constructor(status: number, message: string, response: Response) {
    if (status in tips) {
      super(`${status} ${message} (${tips[status as keyof typeof tips]})`);
    } else {
      super(`${status} ${message}`);
    }
    this.response = response;
  }
}
