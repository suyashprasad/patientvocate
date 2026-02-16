package com.patientvocate.dto;

/**
 * Response DTO for follow-up chat endpoint.
 */
public class ChatResponse {

    private boolean success;
    private String answer;
    private String error;

    public ChatResponse() {}

    public static ChatResponse success(String answer) {
        ChatResponse response = new ChatResponse();
        response.setSuccess(true);
        response.setAnswer(answer);
        return response;
    }

    public static ChatResponse error(String error) {
        ChatResponse response = new ChatResponse();
        response.setSuccess(false);
        response.setError(error);
        return response;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
