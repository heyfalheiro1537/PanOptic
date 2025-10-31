"""
FounderHQ Expense Tracker - Python SDK
Track expenses from custom integrations and AI APIs
"""

import functools
import time
from typing import Any, Callable, Dict, Optional
import requests


class ExpenseTracker:
    """Main expense tracker client"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.founderhq.com"):
        self.api_key = api_key
        self.base_url = base_url
    
    def track(
        self,
        service: str,
        amount: float,
        category: str = "Third-Party Tools",
        pricing_model: str = "usage",
        meta: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Track an expense event"""
        payload = {
            "service": service,
            "amountUsd": amount,
            "category": category,
            "pricingModel": pricing_model,
            "meta": meta or {},
            "timestamp": time.time()
        }
        
        response = requests.post(
            f"{self.base_url}/v1/expenses",
            json=payload,
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        
        return response.json()


def track_openai_tokens(
    api_key: str,
    service_name: str = "OpenAI GPT-4",
    cost_per_1k_tokens: float = 0.03
) -> Callable:
    """
    Decorator to track OpenAI API token usage
    
    Usage:
        @track_openai_tokens(api_key="your-api-key")
        def generate_text(prompt: str) -> str:
            # Your OpenAI API call
            pass
    """
    tracker = ExpenseTracker(api_key)
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            
            # Extract token usage from OpenAI response
            if hasattr(result, 'usage'):
                total_tokens = result.usage.total_tokens
                cost = (total_tokens / 1000) * cost_per_1k_tokens
                
                tracker.track(
                    service=service_name,
                    amount=cost,
                    category="AI Tokens / APIs",
                    pricing_model="usage",
                    meta={"tokens": total_tokens}
                )
            
            return result
        
        return wrapper
    
    return decorator


def track_anthropic_tokens(
    api_key: str,
    service_name: str = "Anthropic Claude",
    cost_per_1k_tokens: float = 0.025
) -> Callable:
    """
    Decorator to track Anthropic API token usage
    
    Usage:
        @track_anthropic_tokens(api_key="your-api-key")
        def generate_text(prompt: str) -> str:
            # Your Anthropic API call
            pass
    """
    tracker = ExpenseTracker(api_key)
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            
            # Extract token usage from Anthropic response
            if hasattr(result, 'usage'):
                total_tokens = result.usage.input_tokens + result.usage.output_tokens
                cost = (total_tokens / 1000) * cost_per_1k_tokens
                
                tracker.track(
                    service=service_name,
                    amount=cost,
                    category="AI Tokens / APIs",
                    pricing_model="usage",
                    meta={"tokens": total_tokens}
                )
            
            return result
        
        return wrapper
    
    return decorator


def track_expense(
    api_key: str,
    service_name: str,
    category: str = "Third-Party Tools",
    pricing_model: str = "usage"
) -> Callable:
    """
    Generic decorator to track custom expenses
    
    Usage:
        @track_expense(
            api_key="your-api-key",
            service_name="Custom API",
            category="AI Tokens / APIs"
        )
        def call_api(data: dict) -> dict:
            # Your API call
            return {"result": ..., "cost": 0.05, "meta": {"requests": 1}}
    """
    tracker = ExpenseTracker(api_key)
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            
            # Extract cost from function return value
            if isinstance(result, dict) and "cost" in result:
                cost = result["cost"]
                meta = result.get("meta", {})
                
                tracker.track(
                    service=service_name,
                    amount=cost,
                    category=category,
                    pricing_model=pricing_model,
                    meta=meta
                )
            
            return result
        
        return wrapper
    
    return decorator


# Example usage
if __name__ == "__main__":
    # Example 1: Track OpenAI usage
    @track_openai_tokens(api_key="your-founderhq-api-key")
    def generate_with_gpt4(prompt: str):
        # Simulated OpenAI response
        class MockResponse:
            class Usage:
                total_tokens = 1500
            usage = Usage()
        
        return MockResponse()
    
    # Example 2: Track custom expense
    @track_expense(
        api_key="your-founderhq-api-key",
        service_name="Custom AI API",
        category="AI Tokens / APIs"
    )
    def call_custom_api(data: dict):
        # Your API logic here
        return {
            "result": {"text": "Generated text"},
            "cost": 0.05,
            "meta": {"requests": 1, "tokens": 1500}
        }
