# TODO.md

## New Gem Files



## Generate 9 tables
When developing the original MEARA Gemini Gem,  the gem would hit a response text limit if it produced the full report AND all 9 tables. 
To workaround this, the gem documents were constructed to instruct the agent to generate the report and stop and ask the user if they want the full detailed analysis tables for all 9 dimensions. The agent would start a new response and generate the tables. 

However, we need to make sure our automation also does the detailed analysis tables for the 9 dimensions without having to ask the user. 
Perhaps they need to generated as a separate process then added to the final document since they are appendices items. 


## FIx executive summary
Make a plan to adjust the meara_doc_modules files to ensure the correct executive summary is produced in the final report. 

The final report executive summary looked like the following:
(BEGIN excerpt)
This analysis follows the required two-part generation process. I will first provide the detailed analysis, starting with the critical issues summary. Then, I will generate and prepend the executive summary for the complete report.

Critical issues summary
This analysis identifies three critical issues that require immediate strategic attention to unblock GGWP's path to scalable, repeatable growth. While the company has achieved impressive early traction through a strong product and founder-led sales, its marketing infrastructure and strategy have not kept pace, creating a significant bottleneck.

Critical Issue #1: A 'Savile Row Suit with No Pockets': World-Class Website with No GTM Instrumentation

Revenue/Growth Impact: Critical. The absence of a data-driven marketing and sales funnel is severely limiting lead generation, preventing optimization, and making growth entirely dependent on the founders' personal networks, which is not scalable.

Root Diagnosis: The company has invested heavily in a technically pristine, brand-aligned digital presence but has completely omitted the foundational marketing technology (conversion tracking, A/B testing, analytics events) required to build a predictable GTM engine.
(END excerpt)
---
I then asked gemini:
"why arent you following the output format shown below that is referenced in the google doc "Instruct_Executive_Summary" in your gem knowledge base?

(BEGIN excerpt)
### Executive Summary

*(Your compelling, two-paragraph introduction goes here.)*

### **Pillar 1: [Name of Your First Pillar]**

*   *(Your most important, self-sufficient takeaway for this pillar.)*
*   *(A second, supporting takeaway.)*
*   *(Optional third takeaway.)*
*   **Supporting Data:** *(An optional, single, powerful data point from the report.)*

### **Pillar 2: [Name of Your Second Pillar]**

*   *(Your most important, self-sufficient takeaway for this pillar.)*
*   *(A second, supporting takeaway.)*
*   *(Optional third takeaway.)*
*   **Supporting Data:** *(An optional, single, powerful data point from the report.)*

*(Repeat for all 4-5 pillars)*
---
### **"Monday Morning" Action Plan**

1.  **[First Concrete Action]:** *(A clear, immediate action a leader should take.)*
2.  **[Second Concrete Action]:** *(A second, clear, immediate action.)*
3.  **[Third Concrete Action]:** *(A third, clear, immediate action.)*

(END excerpt)

To which gemini replied:

"I was following the required two-part generation process outlined in my instructions: produce the detailed analysis first, and then generate and prepend the final executive summary."



## JSON utilization
How might all of this be improved by using JSON to better structure content for formatting, handoffs, outputs, etc. 

