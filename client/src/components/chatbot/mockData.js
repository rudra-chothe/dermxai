import { makeId } from "./utils";

export const INITIAL_CONVERSATIONS = [
  {
    id: "c1",
    title: "Eczema treatment options",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messageCount: 8,
    preview: "What are the best treatment options for moderate eczema?",
    pinned: true,
    folder: "Skin Conditions",
    messages: [
      {
        id: makeId("m"),
        role: "user",
        content: "What are the best treatment options for moderate eczema?",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: makeId("m"),
        role: "assistant",
        content: "For moderate eczema, treatment typically includes topical corticosteroids, moisturizers, and identifying triggers. Let me provide you with detailed options.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString(),
      },
    ],
  },
  {
    id: "c2",
    title: "Psoriasis vs eczema differences",
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    messageCount: 12,
    preview: "How can I tell the difference between psoriasis and eczema?",
    pinned: false,
    folder: "Diagnosis Help",
    messages: [],
  },
  {
    id: "c3",
    title: "Acne treatment for teenagers",
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messageCount: 6,
    preview: "Safe acne treatments for my 16-year-old daughter",
    pinned: false,
    folder: "Acne Care",
    messages: [],
  },
  {
    id: "c4",
    title: "Skin cancer prevention tips",
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    messageCount: 15,
    preview: "What are the best ways to prevent skin cancer?",
    pinned: true,
    folder: "Prevention",
    messages: [],
  },
];

export const INITIAL_TEMPLATES = [
  {
    id: "t1",
    name: "Symptom Description",
    content: `**Symptom Description Template**

**Location:** Where on your body is the issue?

**Duration:** How long have you had this symptom?

**Appearance:** Describe what it looks like (color, size, texture)

**Symptoms:** Any itching, pain, burning, or other sensations?

**Triggers:** What makes it better or worse?

**Previous treatments:** What have you tried so far?

**Medical history:** Any relevant skin conditions or allergies?`,
    snippet: "Structured template for describing skin symptoms...",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t2",
    name: "Treatment Follow-up",
    content: `**Treatment Follow-up**

**Current treatment:** What medication/treatment are you using?

**Duration of use:** How long have you been using it?

**Effectiveness:** Is it helping? (Scale 1-10)

**Side effects:** Any unwanted reactions?

**Compliance:** Are you following instructions exactly?

**Questions:** What concerns do you have?`,
    snippet: "Template for following up on current treatments...",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_FOLDERS = [
  { id: "f1", name: "Skin Conditions" },
  { id: "f2", name: "Diagnosis Help" },
  { id: "f3", name: "Acne Care" },
  { id: "f4", name: "Prevention" },
];