import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ChatRequest, ChatResponse } from "./types";
import { getCorsHeaders } from "./utils/cors";
import { getTapeyResponse } from "./services/claude";
import { buildConversationHistory } from "./services/history";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Log the incoming request for debugging...

  console.log("Received event:", JSON.stringify(event, null, 2));

  // Extract origin from Origin header or Referer header...

  const origin = event.headers.Origin || event.headers.origin;
  const referer = event.headers.Referer || event.headers.referer;

  // If no origin but we have a referer, extract origin from referer...

  let requestOrigin = origin;
  if (!requestOrigin && referer) {
    const match = referer.match(/^(https?:\/\/[^\/]+)/);
    if (match) {
      requestOrigin = match[1];
    } else {
      requestOrigin = referer;
    }
  }

  const corsHeaders = getCorsHeaders(requestOrigin);

  // Handle OPTIONS request for CORS preflight...

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const requestId = event.requestContext.requestId;
    const timestamp = new Date().toISOString();

    // Handle GET request (health check)...

    if (event.httpMethod === "GET") {
      const response: ChatResponse = {
        message:
          "Wraithwatch Chat Bot is running! Send a POST request with a message to start chatting.",
        history: [],
        timestamp,
        requestId,
      };

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(response),
      };
    }

    // Handle POST request (chat)...

    if (event.httpMethod === "POST") {
      let chatRequest: ChatRequest;

      try {
        chatRequest = event.body ? JSON.parse(event.body) : { message: "" };
      } catch {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: "Invalid JSON in request body",
            timestamp,
            requestId,
          }),
        };
      }

      if (!chatRequest.message || chatRequest.message.trim() === "") {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: "Message is required",
            timestamp,
            requestId,
          }),
        };
      }

      // Get response from Tapey (Claude)...

      const tapeyResponse = await getTapeyResponse(
        chatRequest.message,
        chatRequest.history,
      );

      // Build updated conversation history...

      const updatedHistory = buildConversationHistory(
        chatRequest.history || [],
        chatRequest.message,
        tapeyResponse.message,
      );

      const response: ChatResponse = {
        message: tapeyResponse.message,
        history: updatedHistory,
        timestamp,
        requestId,
      };

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(response),
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Method not allowed",
        timestamp,
        requestId,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal server error",
        timestamp: new Date().toISOString(),
        requestId: event.requestContext.requestId,
      }),
    };
  }
};
