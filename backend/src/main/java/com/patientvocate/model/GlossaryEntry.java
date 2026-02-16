package com.patientvocate.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GlossaryEntry {

    private String term;
    private String definition;

    public GlossaryEntry() {}

    public GlossaryEntry(String term, String definition) {
        this.term = term;
        this.definition = definition;
    }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getDefinition() { return definition; }
    public void setDefinition(String definition) { this.definition = definition; }
}
