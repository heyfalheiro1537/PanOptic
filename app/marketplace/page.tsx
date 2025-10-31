"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, Check, Plus } from "lucide-react"
import { useState } from "react"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  logo: string
  installed: boolean
  popular?: boolean
}

const integrations: Integration[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Track GPT-4, GPT-3.5, and embeddings usage automatically",
    category: "AI Tokens / APIs",
    logo: "https://img.logo.dev/chatgpt.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: true,
    popular: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Monitor Claude model usage and costs",
    category: "AI Tokens / APIs",
    logo: "https://img.logo.dev/anthropic.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: true,
    popular: true,
  },
  {
    id: "aws",
    name: "AWS",
    description: "Connect to AWS Cost Explorer for EC2, S3, and more",
    category: "Infrastructure",
    logo: "https://img.logo.dev/aws.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: true,
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Track hosting and bandwidth costs",
    category: "Hosting & DevOps",
    logo: "https://img.logo.dev/v0.dev?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Monitor payment processing fees",
    category: "Third-Party Tools",
    logo: "https://img.logo.dev/stripe.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: true,
  },
  {
    id: "cohere",
    name: "Cohere",
    description: "Track Cohere AI model usage and embeddings",
    category: "AI Tokens / APIs",
    logo: "https://img.logo.dev/cohere.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: false,
    popular: true,
  },
  {
    id: "replicate",
    name: "Replicate",
    description: "Monitor AI model inference costs",
    category: "AI Tokens / APIs",
    logo: "https://img.logo.dev/replicate.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: false,
  },
  {
    id: "gcp",
    name: "Google Cloud",
    description: "Connect to GCP billing for compute and storage",
    category: "Infrastructure",
    logo: "https://img.logo.dev/google.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: false,
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    description: "Track Azure resource costs",
    category: "Infrastructure",
    logo: "https://img.logo.dev/microsoft.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: false,
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Monitor observability and APM costs",
    category: "Third-Party Tools",
    logo: "https://img.logo.dev/datadoghq.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: false,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Track Actions, Copilot, and seat costs",
    category: "Third-Party Tools",
    logo: "https://img.logo.dev/github.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: false,
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "Monitor CDN and Workers usage",
    category: "Hosting & DevOps",
    logo: "https://img.logo.dev/cloudfare.com?token=pk_dRI6rSooQUyHy9Hbe0Pciw&format=png",
    installed: false,
  },
]

export default function MarketplacePage() {
  const [installedIntegrations, setInstalledIntegrations] = useState<Set<string>>(
    new Set(integrations.filter((i) => i.installed).map((i) => i.id)),
  )

  const handleInstall = (id: string) => {
    setInstalledIntegrations((prev) => new Set([...prev, id]))
  }

  const handleUninstall = (id: string) => {
    setInstalledIntegrations((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const installedList = integrations.filter((i) => installedIntegrations.has(i.id))
  const availableList = integrations.filter((i) => !installedIntegrations.has(i.id))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Store className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Marketplace</h1>
        </div>
        <p className="text-muted-foreground">Connect native integrations to automatically track expenses</p>
      </div>

      {/* Installed Integrations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Installed ({installedList.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {installedList.map((integration) => (
            <Card key={integration.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={integration.logo || "/placeholder.svg"}
                      alt={integration.name}
                      className="h-12 w-12 rounded"
                    />
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {integration.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    Installed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleUninstall(integration.id)}
                >
                  Uninstall
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available ({availableList.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableList.map((integration) => (
            <Card key={integration.id} className="relative">
              {integration.popular && (
                <Badge className="absolute top-3 right-3" variant="default">
                  Popular
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src={integration.logo || "/placeholder.svg"}
                    alt={integration.name}
                    className="h-12 w-12 rounded"
                  />
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                <Button size="sm" className="w-full gap-2" onClick={() => handleInstall(integration.id)}>
                  <Plus className="h-4 w-4" />
                  Install
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
