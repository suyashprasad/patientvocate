package com.patientvocate.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ReportSummary {

    private String summary;
    private List<Finding> findings;
    private List<GlossaryEntry> glossary;
    private List<DiscussionQuestion> discussionQuestions;
    private String disclaimer;

    public ReportSummary() {}

    public ReportSummary(String summary, List<Finding> findings, List<GlossaryEntry> glossary,
                         List<DiscussionQuestion> discussionQuestions, String disclaimer) {
        this.summary = summary;
        this.findings = findings;
        this.glossary = glossary;
        this.discussionQuestions = discussionQuestions;
        this.disclaimer = disclaimer;
    }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<Finding> getFindings() { return findings; }
    public void setFindings(List<Finding> findings) { this.findings = findings; }

    public List<GlossaryEntry> getGlossary() { return glossary; }
    public void setGlossary(List<GlossaryEntry> glossary) { this.glossary = glossary; }

    public List<DiscussionQuestion> getDiscussionQuestions() { return discussionQuestions; }
    public void setDiscussionQuestions(List<DiscussionQuestion> discussionQuestions) { this.discussionQuestions = discussionQuestions; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
