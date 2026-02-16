package com.patientvocate.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Finding {

    private String testName;
    private String value;
    private String referenceRange;
    private String status; // NORMAL, BORDERLINE, ABNORMAL
    private String explanation;

    public Finding() {}

    public Finding(String testName, String value, String referenceRange, String status, String explanation) {
        this.testName = testName;
        this.value = value;
        this.referenceRange = referenceRange;
        this.status = status;
        this.explanation = explanation;
    }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getReferenceRange() { return referenceRange; }
    public void setReferenceRange(String referenceRange) { this.referenceRange = referenceRange; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
