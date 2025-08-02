import { handler } from "./handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getCorsHeaders } from "./utils/cors";
import { getTapeyResponse } from "./services/claude";

// Mock the dependencies
jest.mock("./utils/cors");
jest.mock("./services/claude");

const mockGetCorsHeaders = getCorsHeaders as jest.MockedFunction<
  typeof getCorsHeaders
>;
const mockGetTapeyResponse = getTapeyResponse as jest.MockedFunction<
  typeof getTapeyResponse
>;

const getMockEvent = (
  httpMethod = "GET",
  body?: string,
): APIGatewayProxyEvent => ({
  httpMethod,
  path: "/",
  headers: {},
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: "123456789012",
    apiId: "api-id",
    authorizer: {},
    httpMethod,
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: "127.0.0.1",
      user: null,
      userAgent: null,
      userArn: null,
    },
    path: "/",
    protocol: "HTTP/1.1",
    requestId: "test-request-id",
    requestTime: "12/Mar/2020:19:03:58 +0000",
    requestTimeEpoch: 1583348638390,
    resourceId: "resource-id",
    resourcePath: "/",
    stage: "dev",
  },
  resource: "/",
  body: body || null,
  isBase64Encoded: false,
});

describe("Blockbuster Index Chat Bot Handler", () => {
  let originalConsoleError: typeof console.error;
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    jest.clearAllMocks();
    originalConsoleError = console.error;
    originalConsoleLog = console.log;
    console.error = jest.fn();
    console.log = jest.fn();

    mockGetCorsHeaders.mockReturnValue({
      "Access-Control-Allow-Origin": "https://www.blockbusterindex.com",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Content-Type": "application/json",
    });

    mockGetTapeyResponse.mockResolvedValue({
      message: "Hey there, dude! That's totally awesome!",
    });
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  it("should handle OPTIONS request for CORS preflight", async () => {
    const event = getMockEvent("OPTIONS");
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      "Access-Control-Allow-Origin": "https://www.blockbusterindex.com",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Content-Type": "application/json",
    });
    expect(result.body).toBe("");
  });

  it("should return a 200 response with health check message for GET request", async () => {
    const event = getMockEvent("GET");
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      "Access-Control-Allow-Origin": "https://www.blockbusterindex.com",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Content-Type": "application/json",
    });

    const responseBody = JSON.parse(result.body!);
    expect(responseBody.message).toContain(
      "Blockbuster Index Chat Bot is running!",
    );
    expect(responseBody.timestamp).toBeDefined();
    expect(responseBody.requestId).toBe("test-request-id");
    expect(responseBody.history).toEqual([]);
  });

  it("should handle POST request with valid message", async () => {
    const event = getMockEvent(
      "POST",
      JSON.stringify({ message: "Hello bot!" }),
    );
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      "Access-Control-Allow-Origin": "https://www.blockbusterindex.com",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Content-Type": "application/json",
    });

    const responseBody = JSON.parse(result.body!);
    expect(responseBody.message).toContain("Hey there, dude!");
    expect(responseBody.timestamp).toBeDefined();
    expect(responseBody.requestId).toBe("test-request-id");
    expect(responseBody.history).toHaveLength(2);
    expect(responseBody.history[0]).toEqual({
      role: "user",
      content: "Hello bot!",
      timestamp: expect.any(String),
    });
    expect(responseBody.history[1]).toEqual({
      role: "assistant",
      content: "Hey there, dude! That's totally awesome!",
      timestamp: expect.any(String),
    });
    expect(mockGetTapeyResponse).toHaveBeenCalledWith("Hello bot!", undefined);
  });

  it("should return 400 for POST request with empty message", async () => {
    const event = getMockEvent("POST", JSON.stringify({ message: "" }));
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.error).toBe("Message is required");
  });

  it("should return 400 for POST request with invalid JSON", async () => {
    const event = getMockEvent("POST", "invalid json");
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.error).toBe("Invalid JSON in request body");
  });

  it("should return 405 for unsupported HTTP method", async () => {
    const event = getMockEvent("PUT");
    const result = await handler(event);

    expect(result.statusCode).toBe(405);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.error).toBe("Method not allowed");
  });

  it("should handle POST request with existing conversation history", async () => {
    const existingHistory = [
      {
        role: "user" as const,
        content: "Previous message",
        timestamp: "2023-01-01T00:00:00Z",
      },
      {
        role: "assistant" as const,
        content: "Previous response",
        timestamp: "2023-01-01T00:00:01Z",
      },
    ];

    const event = getMockEvent(
      "POST",
      JSON.stringify({
        message: "Follow up question",
        history: existingHistory,
      }),
    );
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.history).toHaveLength(4);
    expect(responseBody.history[0].content).toBe("Previous message");
    expect(responseBody.history[1].content).toBe("Previous response");
    expect(responseBody.history[2].content).toBe("Follow up question");
    expect(responseBody.history[3].content).toBe(
      "Hey there, dude! That's totally awesome!",
    );
    expect(mockGetTapeyResponse).toHaveBeenCalledWith(
      "Follow up question",
      existingHistory,
    );
  });

  it("should limit conversation history to 5 messages", async () => {
    const longHistory = [
      {
        role: "user" as const,
        content: "Old 1",
        timestamp: "2023-01-01T00:00:00Z",
      },
      {
        role: "assistant" as const,
        content: "Old 1 response",
        timestamp: "2023-01-01T00:00:01Z",
      },
      {
        role: "user" as const,
        content: "Old 2",
        timestamp: "2023-01-01T00:00:02Z",
      },
      {
        role: "assistant" as const,
        content: "Old 2 response",
        timestamp: "2023-01-01T00:00:03Z",
      },
      {
        role: "user" as const,
        content: "Old 3",
        timestamp: "2023-01-01T00:00:04Z",
      },
      {
        role: "assistant" as const,
        content: "Old 3 response",
        timestamp: "2023-01-01T00:00:05Z",
      },
      {
        role: "user" as const,
        content: "Old 4",
        timestamp: "2023-01-01T00:00:06Z",
      },
      {
        role: "assistant" as const,
        content: "Old 4 response",
        timestamp: "2023-01-01T00:00:07Z",
      },
    ];

    const event = getMockEvent(
      "POST",
      JSON.stringify({
        message: "New message",
        history: longHistory,
      }),
    );
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.history).toHaveLength(5); // Limited to 5 messages
    expect(responseBody.history[0].content).toBe("Old 3 response"); // Oldest kept message
    expect(responseBody.history[4].content).toBe(
      "Hey there, dude! That's totally awesome!",
    ); // Newest message
  });

  it("should handle POST request with null body", async () => {
    const event = getMockEvent("POST", undefined);
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.error).toBe("Message is required");
  });

  it("should handle POST request with missing message property", async () => {
    const event = getMockEvent("POST", JSON.stringify({}));
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.error).toBe("Message is required");
  });

  it("should handle POST request with whitespace-only message", async () => {
    const event = getMockEvent("POST", JSON.stringify({ message: "   " }));
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.error).toBe("Message is required");
  });

  it("should handle origin extraction when referer doesn't match regex", async () => {
    const event = getMockEvent("POST", JSON.stringify({ message: "Hello" }));
    event.headers.Origin = undefined;
    event.headers.origin = undefined;
    event.headers.Referer = "invalid-url-format";
    event.headers.referer = "invalid-url-format";

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.message).toContain("Hey there, dude!");
  });

  it("should handle Claude API error gracefully", async () => {
    mockGetTapeyResponse.mockResolvedValue({
      message:
        "Sorry dude, I'm having some technical difficulties right now! Try again in a bit!",
      error: "API Error",
    });

    const event = getMockEvent("POST", JSON.stringify({ message: "Hello" }));
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.message).toContain(
      "Sorry dude, I'm having some technical difficulties",
    );
  });

  it("should handle general error in handler", async () => {
    mockGetTapeyResponse.mockRejectedValue(new Error("Unexpected error"));

    const event = getMockEvent("POST", JSON.stringify({ message: "Hello" }));
    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body!);
    expect(responseBody.error).toBe("Internal server error");
    expect(console.error).toHaveBeenCalled();
  });
});

describe("Barrel Exports", () => {
  it("should export all constants", async () => {
    const { ALLOWED_ORIGINS, CLAUDE_MODEL, MAX_TOKENS, TAPEY_SYSTEM_PROMPT } =
      await import("./constants");
    expect(ALLOWED_ORIGINS).toBeDefined();
    expect(CLAUDE_MODEL).toBeDefined();
    expect(MAX_TOKENS).toBeDefined();
    expect(TAPEY_SYSTEM_PROMPT).toBeDefined();
  });

  it("should export all services", async () => {
    const { getTapeyResponse } = await import("./services");
    expect(getTapeyResponse).toBeDefined();
  });

  it("should export all utils", async () => {
    const { getCorsHeaders } = await import("./utils");
    expect(getCorsHeaders).toBeDefined();
  });

  it("should export everything from main index", async () => {
    const mainExports = await import("./index");
    expect(mainExports).toBeDefined();
  });
});

describe("CORS Utils", () => {
  it("should return correct CORS headers for allowed origin", () => {
    const headers = getCorsHeaders("https://www.blockbusterindex.com");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://www.blockbusterindex.com",
    );
  });

  it("should return default CORS headers for disallowed origin", () => {
    const headers = getCorsHeaders("https://malicious-site.com");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://www.blockbusterindex.com",
    );
  });

  it("should return default CORS headers for undefined origin", () => {
    const headers = getCorsHeaders(undefined);
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://www.blockbusterindex.com",
    );
  });

  it("should return default CORS headers for empty origin", () => {
    const headers = getCorsHeaders("");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://www.blockbusterindex.com",
    );
  });
});
