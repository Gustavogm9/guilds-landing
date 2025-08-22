import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  questions: FAQItem[];
}

export function FAQ({ questions }: FAQProps) {
  // Schema.org FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((item, index) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Accordion type="single" collapsible className="w-full space-y-4">
        {questions.map((item, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border rounded-lg px-6 py-2 bg-card shadow-sm"
          >
            <AccordionTrigger className="text-left font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}