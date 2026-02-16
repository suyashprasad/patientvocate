package com.patientvocate.model;

import java.util.List;

/**
 * Represents a single message in the follow-up chat conversation.
 */
public class ChatMessage {

    private String role; // "user" or "assistant"
    private String content;

    public ChatMessage() {}

    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
