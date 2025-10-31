"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Documentation</h1>
        </div>
        <p className="text-muted-foreground">
          Track expenses from custom integrations using our wrapper functions and decorators
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="node">Node.js</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                FounderHQ provides wrapper functions and decorators to automatically track expenses from services that
                don't have native integrations. This is perfect for DIY integrations or custom API usage tracking.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Key Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Automatic token counting for AI APIs</li>
                  <li>Cost calculation based on usage</li>
                  <li>Zero-overhead decorators</li>
                  <li>Support for custom pricing models</li>
                  <li>Real-time expense tracking</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Supported Services:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>OpenAI (GPT-4, GPT-3.5, Embeddings)</li>
                  <li>Anthropic (Claude models)</li>
                  <li>Custom AI APIs</li>
                  <li>Any usage-based service</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">pip install founderhq-tracker</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard("pip install founderhq-tracker", "py-install")}
                >
                  {copiedId === "py-install" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Track OpenAI API Calls</h4>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`from founderhq import track_openai_tokens
import openai

@track_openai_tokens(
    api_key="your-founderhq-api-key",
    service_name="OpenAI GPT-4"
)
def generate_text(prompt: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# Usage
result = generate_text("Explain quantum computing")
# Automatically tracked: tokens used, cost, timestamp`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `from founderhq import track_openai_tokens\nimport openai\n\n@track_openai_tokens(\n    api_key="your-founderhq-api-key",\n    service_name="OpenAI GPT-4"\n)\ndef generate_text(prompt: str) -> str:\n    response = openai.ChatCompletion.create(\n        model="gpt-4",\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.choices[0].message.content\n\n# Usage\nresult = generate_text("Explain quantum computing")\n# Automatically tracked: tokens used, cost, timestamp`,
                        "py-openai",
                      )
                    }
                  >
                    {copiedId === "py-openai" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Track Custom Expenses</h4>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`from founderhq import track_expense

@track_expense(
    api_key="your-founderhq-api-key",
    service_name="Custom AI API",
    category="AI Tokens / APIs",
    pricing_model="usage"
)
def call_custom_api(data: dict) -> dict:
    # Your API call logic
    response = requests.post("https://api.example.com", json=data)
    
    # Return cost and metadata
    return {
        "result": response.json(),
        "cost": 0.05,  # $0.05 per request
        "meta": {"requests": 1, "tokens": 1500}
    }

# Usage
result = call_custom_api({"prompt": "Hello world"})
# Tracked with custom cost and metadata`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `from founderhq import track_expense\n\n@track_expense(\n    api_key="your-founderhq-api-key",\n    service_name="Custom AI API",\n    category="AI Tokens / APIs",\n    pricing_model="usage"\n)\ndef call_custom_api(data: dict) -> dict:\n    # Your API call logic\n    response = requests.post("https://api.example.com", json=data)\n    \n    # Return cost and metadata\n    return {\n        "result": response.json(),\n        "cost": 0.05,  # $0.05 per request\n        "meta": {"requests": 1, "tokens": 1500}\n    }\n\n# Usage\nresult = call_custom_api({"prompt": "Hello world"})\n# Tracked with custom cost and metadata`,
                        "py-custom",
                      )
                    }
                  >
                    {copiedId === "py-custom" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="node" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">npm install @founderhq/tracker</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard("npm install @founderhq/tracker", "node-install")}
                >
                  {copiedId === "node-install" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Track OpenAI API Calls</h4>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`import { trackOpenAI } from '@founderhq/tracker';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const trackedOpenAI = trackOpenAI(openai, {
  apiKey: 'your-founderhq-api-key',
  serviceName: 'OpenAI GPT-4',
});

async function generateText(prompt: string) {
  const response = await trackedOpenAI.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });
  
  return response.choices[0].message.content;
}

// Usage
const result = await generateText('Explain quantum computing');
// Automatically tracked: tokens used, cost, timestamp`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `import { trackOpenAI } from '@founderhq/tracker';\nimport OpenAI from 'openai';\n\nconst openai = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n});\n\nconst trackedOpenAI = trackOpenAI(openai, {\n  apiKey: 'your-founderhq-api-key',\n  serviceName: 'OpenAI GPT-4',\n});\n\nasync function generateText(prompt: string) {\n  const response = await trackedOpenAI.chat.completions.create({\n    model: 'gpt-4',\n    messages: [{ role: 'user', content: prompt }],\n  });\n  \n  return response.choices[0].message.content;\n}\n\n// Usage\nconst result = await generateText('Explain quantum computing');\n// Automatically tracked: tokens used, cost, timestamp`,
                        "node-openai",
                      )
                    }
                  >
                    {copiedId === "node-openai" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Track Custom Expenses</h4>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`import { trackExpense } from '@founderhq/tracker';

const tracker = trackExpense({
  apiKey: 'your-founderhq-api-key',
  serviceName: 'Custom AI API',
  category: 'AI Tokens / APIs',
  pricingModel: 'usage',
});

async function callCustomAPI(data: any) {
  const response = await fetch('https://api.example.com', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  // Track the expense
  await tracker.track({
    cost: 0.05, // $0.05 per request
    meta: { requests: 1, tokens: 1500 },
  });
  
  return result;
}

// Usage
const result = await callCustomAPI({ prompt: 'Hello world' });
// Tracked with custom cost and metadata`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `import { trackExpense } from '@founderhq/tracker';\n\nconst tracker = trackExpense({\n  apiKey: 'your-founderhq-api-key',\n  serviceName: 'Custom AI API',\n  category: 'AI Tokens / APIs',\n  pricingModel: 'usage',\n});\n\nasync function callCustomAPI(data: any) {\n  const response = await fetch('https://api.example.com', {\n    method: 'POST',\n    body: JSON.stringify(data),\n  });\n  \n  const result = await response.json();\n  \n  // Track the expense\n  await tracker.track({\n    cost: 0.05, // $0.05 per request\n    meta: { requests: 1, tokens: 1500 },\n  });\n  \n  return result;\n}\n\n// Usage\nconst result = await callCustomAPI({ prompt: 'Hello world' });\n// Tracked with custom cost and metadata`,
                        "node-custom",
                      )
                    }
                  >
                    {copiedId === "node-custom" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Required Parameters</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <code className="bg-muted px-2 py-1 rounded">api_key</code> - Your FounderHQ API key
                    </li>
                    <li>
                      <code className="bg-muted px-2 py-1 rounded">service_name</code> - Name of the service being
                      tracked
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Optional Parameters</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <code className="bg-muted px-2 py-1 rounded">category</code> - Category of expense (default:
                      "Third-Party Tools")
                    </li>
                    <li>
                      <code className="bg-muted px-2 py-1 rounded">pricing_model</code> - Pricing model: "usage",
                      "seat", "tiered", "flat"
                    </li>
                    <li>
                      <code className="bg-muted px-2 py-1 rounded">meta</code> - Additional metadata (tokens, requests,
                      etc.)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-muted px-2 py-1 rounded">Infrastructure</code> - Cloud compute, storage, databases
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded">AI Tokens / APIs</code> - AI model APIs, embeddings
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded">Hosting & DevOps</code> - Hosting, CDN, monitoring
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded">Third-Party Tools</code> - SaaS tools, analytics
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
