package com.patientvocate.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DiscussionQuestion {

    private String question;
    private String context;

    public DiscussionQuestion() {}

    public DiscussionQuestion(String question, String context) {
        this.question = question;
        this.context = context;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
}
