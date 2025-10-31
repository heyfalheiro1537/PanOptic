/**
 * FounderHQ Expense Tracker - Node.js SDK
 * Track expenses from custom integrations and AI APIs
 */

class ExpenseTracker {
  constructor(apiKey, baseUrl = "https://api.founderhq.com") {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async track(options) {
    const { service, amount, category = "Third-Party Tools", pricingModel = "usage", meta = {} } = options

    const payload = {
      service,
      amountUsd: amount,
      category,
      pricingModel,
      meta,
      timestamp: Date.now(),
    }

    const response = await fetch(`${this.baseUrl}/v1/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    return response.json()
  }
}

/**
 * Wrap OpenAI client to track token usage
 */
export function trackOpenAI(openaiClient, options) {
  const { apiKey, serviceName = "OpenAI GPT-4", costPer1kTokens = 0.03 } = options
  const tracker = new ExpenseTracker(apiKey)

  return new Proxy(openaiClient, {
    get(target, prop) {
      const original = target[prop]

      if (prop === "chat") {
        return new Proxy(original, {
          get(chatTarget, chatProp) {
            const chatOriginal = chatTarget[chatProp]

            if (chatProp === "completions") {
              return new Proxy(chatOriginal, {
                get(completionsTarget, completionsProp) {
                  const completionsOriginal = completionsTarget[completionsProp]

                  if (completionsProp === "create") {
                    return async (...args) => {
                      const result = await completionsOriginal.apply(completionsTarget, args)

                      // Track token usage
                      if (result.usage) {
                        const totalTokens = result.usage.total_tokens
                        const cost = (totalTokens / 1000) * costPer1kTokens

                        await tracker.track({
                          service: serviceName,
                          amount: cost,
                          category: "AI Tokens / APIs",
                          pricingModel: "usage",
                          meta: { tokens: totalTokens },
                        })
                      }

                      return result
                    }
                  }

                  return completionsOriginal
                },
              })
            }

            return chatOriginal
          },
        })
      }

      return original
    },
  })
}

/**
 * Create an expense tracker for custom usage
 */
export function trackExpense(options) {
  const { apiKey, serviceName, category = "Third-Party Tools", pricingModel = "usage" } = options

  const tracker = new ExpenseTracker(apiKey)

  return {
    async track(expenseData) {
      const { cost, meta = {} } = expenseData

      return tracker.track({
        service: serviceName,
        amount: cost,
        category,
        pricingModel,
        meta,
      })
    },
  }
}

// Example usage
async function example() {
  // Example 1: Track OpenAI usage
  const OpenAI = (await import("openai")).default
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const trackedOpenAI = trackOpenAI(openai, {
    apiKey: "your-founderhq-api-key",
    serviceName: "OpenAI GPT-4",
  })

  const response = await trackedOpenAI.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello!" }],
  })

  // Example 2: Track custom expense
  const customTracker = trackExpense({
    apiKey: "your-founderhq-api-key",
    serviceName: "Custom AI API",
    category: "AI Tokens / APIs",
  })

  await customTracker.track({
    cost: 0.05,
    meta: { requests: 1, tokens: 1500 },
  })
}

export { ExpenseTracker }
