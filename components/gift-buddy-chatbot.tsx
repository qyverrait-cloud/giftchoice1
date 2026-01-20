"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Sparkles, Gift, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import gsap from "gsap"
import Link from "next/link"
import { products, categories } from "@/lib/mock-data"
import { searchProducts } from "@/lib/search"
import type { Product } from "@/lib/types"
import { Chatbot3DAvatar } from "@/components/chatbot-3d-avatar"

const WHATSAPP_NUMBER = "919799964364"

// Gift Buddy Personality - Unique responses
const giftBuddyPersonality = {
  greetings: [
    "Namaste! 😊 Main Gift Buddy hoon - aapka gift-finding friend!",
    "Hey! 👋 Gift Buddy yahan! Ready to find perfect gift?",
    "Hello! 🎁 Main Gift Buddy - aapki gift shopping me help karne aaya hoon!",
  ],
  enthusiasm: [
    "Wah! 😄",
    "Perfect choice! 🎉",
    "Great! Main help kar deta hoon! 👍",
    "Excellent! 🎊",
  ],
  thinking: [
    "Hmm... let me think... 🤔",
    "Perfect gift dhoondh raha hoon... ✨",
    "Aapke liye best options check kar raha hoon... 🔍",
  ],
  found: [
    "Mil gaya! 🎯 Perfect match!",
    "Found it! 🎁 Ye perfect rahega!",
    "Yeh lo! ✨ Aapke liye best options!",
  ],
}

type ChatState = "hidden" | "namaste" | "intro" | "conversation" | "suggestion" | "whatsapp"

interface ChatMessage {
  text: string
  buttons?: string[]
  sender: "bot" | "user"
  id: string
  products?: Product[]
}

// Client-side only ID generator to prevent hydration mismatch
let messageIdCounter = 0
const getUniqueId = () => {
  if (typeof window === "undefined") {
    return `msg-${++messageIdCounter}`
  }
  messageIdCounter++
  return `msg-${messageIdCounter}-${Date.now()}`
}

export function GiftBuddyChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatState, setChatState] = useState<ChatState>("hidden")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [conversationContext, setConversationContext] = useState({
    occasion: "",
    recipient: "",
    budget: "",
    preferences: [] as string[],
  })
  const [hasStarted, setHasStarted] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mood, setMood] = useState<"happy" | "thinking" | "excited">("happy")
  const [showSparkles, setShowSparkles] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedGreeting, setSelectedGreeting] = useState<string>("")
  const [avatarError, setAvatarError] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const avatarRef = useRef<HTMLDivElement>(null)
  const sparklesRef = useRef<HTMLDivElement>(null)

  // Client-side only mount - prevent hydration mismatch
  useEffect(() => {
    if (typeof window === "undefined") return
    setIsMounted(true)
    // Select greeting once on mount (client-side only)
    setSelectedGreeting(giftBuddyPersonality.greetings[Math.floor(Math.random() * giftBuddyPersonality.greetings.length)])
  }, [])

  // Delayed popup - 8-10 seconds or after scroll (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return

    const scrollTimer = setTimeout(() => {
      if (!hasScrolled) {
        setHasScrolled(true)
      }
    }, 8500)

    const scrollHandler = () => {
      if (!hasScrolled) {
        setHasScrolled(true)
      }
    }

    window.addEventListener("scroll", scrollHandler)

    return () => {
      clearTimeout(scrollTimer)
      window.removeEventListener("scroll", scrollHandler)
    }
  }, [hasScrolled, isMounted])

  // Show chatbot after delay or scroll (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return
    if (hasScrolled && chatState === "hidden") {
      const showTimer = setTimeout(() => {
        if (chatState === "hidden") {
          setChatState("namaste")
        }
      }, 1000)

      return () => clearTimeout(showTimer)
    }
  }, [hasScrolled, chatState, isMounted])

  // Avatar animation - Continuous playful "musti" animation (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || !avatarRef.current) return

    // Continuous playful animation - musti karte rehna (always active)
    const tl = gsap.timeline({ repeat: -1 })
    
    // Floating up with slight rotation (musti style)
    tl.to(avatarRef.current, {
      y: -18,
      rotation: 8,
      scale: 1.1,
      duration: 1.5,
      ease: "power1.inOut",
    })
    // Floating down with opposite rotation
    .to(avatarRef.current, {
      y: 0,
      rotation: -8,
      scale: 1,
      duration: 1.5,
      ease: "power1.inOut",
    })
    // Slight bounce (musti effect)
    .to(avatarRef.current, {
      y: -10,
      rotation: 5,
      scale: 1.06,
      duration: 1,
      ease: "power2.out",
    })
    .to(avatarRef.current, {
      y: 0,
      rotation: -3,
      scale: 1,
      duration: 1,
      ease: "power2.in",
    })
    // Another bounce for more playful effect
    .to(avatarRef.current, {
      y: -12,
      rotation: 6,
      scale: 1.08,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
    })
    .to(avatarRef.current, {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.2,
      ease: "elastic.in(1, 0.5)",
    })

    return () => {
      tl.kill()
    }
  }, [isMounted])

  // Additional animation when chatbot is open
  useEffect(() => {
    if (!isMounted || !avatarRef.current || !isOpen) return

    // More active animation when open
    const activeAnim = gsap.to(avatarRef.current, {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: "none",
    })

    return () => {
      activeAnim.kill()
    }
  }, [isOpen, isMounted])

  // Sparkles animation (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || !showSparkles || !sparklesRef.current) return

    const sparkles = sparklesRef.current.querySelectorAll(".sparkle")
    const animations: gsap.core.Tween[] = []
    
    sparkles.forEach((sparkle, i) => {
      const anim = gsap.fromTo(
        sparkle,
        { opacity: 0, scale: 0, y: 0 },
        {
          opacity: 1,
          scale: 1,
          y: -30,
          duration: 1,
          delay: i * 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(sparkle, { opacity: 0, scale: 0, duration: 0.5 })
          },
        }
      )
      animations.push(anim)
    })
    
    const timer = setTimeout(() => setShowSparkles(false), 2000)

    return () => {
      clearTimeout(timer)
      animations.forEach(anim => anim.kill())
    }
  }, [showSparkles, isMounted])

  // Sequential messages with typing effect
  useEffect(() => {
    if (!isOpen || !hasStarted) return

    if (chatState === "namaste") {
      setMood("excited")
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setShowSparkles(true)
        const greeting = selectedGreeting || giftBuddyPersonality.greetings[0]
        const namasteMsg: ChatMessage = {
          text: greeting,
          sender: "bot",
          id: getUniqueId(),
        }
        setMessages([namasteMsg])
        
        setTimeout(() => {
          setChatState("intro")
        }, 2000)
      }, 1000)
    } else if (chatState === "intro") {
      setMood("happy")
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const introMsg: ChatMessage = {
          text: "Main Gift Buddy hoon – aapka personal gift assistant! 🎁✨\n\nGift choose karna hai? Main aapki har step me help karunga!",
          buttons: ["Haan, help chahiye! 🎉", "Nahi, baad mein"],
          sender: "bot",
          id: getUniqueId(),
        }
        setMessages((prev) => [...prev, introMsg])
      }, 1200)
    }
  }, [isOpen, chatState, hasStarted])

  // Animate new messages (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return

    messages.forEach((msg) => {
      const element = messageRefs.current.get(msg.id)
      if (element) {
        gsap.fromTo(
          element,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.2)" }
        )
      }
    })
  }, [messages, isMounted])

  // Auto scroll to bottom (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping, isMounted])

  // Focus input when conversation starts (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return
    if (chatState === "conversation" && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 500)
    }
  }, [chatState, isMounted])

  // Website knowledge base
  const getWebsiteInfo = (query: string): string | { text: string; products: Product[] } | null => {
    const lowerQuery = query.toLowerCase()

    // Delivery questions
    if (lowerQuery.includes("delivery") || lowerQuery.includes("deliver") || lowerQuery.includes("kitne din")) {
      return "🚚 Delivery Info (Gift Buddy Special!):\n\n⚡ 60 Min Express Delivery - Select areas me!\n📦 Standard: 2-3 business days\n🎁 Free delivery on orders above ₹999\n📱 Track via WhatsApp anytime!\n\nGift Buddy guarantee: Fast & safe delivery! ✨"
    }

    // Payment questions
    if (lowerQuery.includes("payment") || lowerQuery.includes("pay") || lowerQuery.includes("kaise pay") || lowerQuery.includes("cash")) {
      return "💳 Payment Options:\n• Cash on Delivery (COD)\n• Online payment (UPI, Cards, Wallets)\n• Secure payment gateway\n• No hidden charges"
    }

    // Return/Exchange questions
    if (lowerQuery.includes("return") || lowerQuery.includes("exchange") || lowerQuery.includes("badal") || lowerQuery.includes("wapas")) {
      return "🔄 Return Policy:\n• 7-day hassle-free return\n• Unused items in original packaging\n• Easy return process via WhatsApp\n• Full refund or exchange available"
    }

    // Gift wrapping
    if (lowerQuery.includes("wrap") || lowerQuery.includes("packaging") || lowerQuery.includes("gift box")) {
      return "🎁 Gift Wrapping:\n• Beautiful complimentary gift packaging\n• Free gift wrapping on all orders\n• Custom message card included\n• Perfect presentation guaranteed"
    }

    // Categories
    if (lowerQuery.includes("category") || lowerQuery.includes("kya kya hai") || lowerQuery.includes("types")) {
      const categoryList = categories.map(cat => `🎁 ${cat.name}`).join("\n")
      return `📦 Gift Buddy's Categories Collection:\n\n${categoryList}\n\n✨ Har category me unique gifts hain!\nKis category me interest hai? Main detailed info de sakta hoon! 😊`
    }

    // Products
    if (lowerQuery.includes("product") || lowerQuery.includes("kya kya milta") || lowerQuery.includes("items")) {
      return `🛍️ Products:\nHumare paas ${products.length}+ unique gifts hain:\n• Water Bottles\n• Soft Toys\n• Photo Frames\n• Personalized Gifts\n• Anniversary Gifts\n• Birthday Gifts\n\nKya specific product chahiye?`
    }

    // Price range
    if (lowerQuery.includes("price") || lowerQuery.includes("kitna") || lowerQuery.includes("cost") || lowerQuery.includes("rate")) {
      const minPrice = Math.min(...products.map(p => p.sizes ? p.sizes[0].price : p.price))
      const maxPrice = Math.max(...products.map(p => p.sizes ? p.sizes[0].price : p.price))
      return `💰 Price Range:\n• Starting from ₹${minPrice}\n• Up to ₹${maxPrice}+\n• Budget-friendly options available\n• Premium gifts also available\n\nAapka budget kitna hai?`
    }

    // Contact/Support
    if (lowerQuery.includes("contact") || lowerQuery.includes("phone") || lowerQuery.includes("number") || lowerQuery.includes("help")) {
      return "📞 Contact Us:\n• WhatsApp: 97999 64364\n• 24/7 Customer Support\n• Quick response guaranteed\n• We're here to help! 😊"
    }

    // About website
    if (lowerQuery.includes("about") || lowerQuery.includes("kya hai") || lowerQuery.includes("company") || lowerQuery.includes("gift buddy")) {
      return "🏢 About Gift Choice & Gift Buddy:\n\n✨ Premium gift store with unique selections\n🎁 Thoughtful gifts for every emotion\n⚡ Lightning-fast delivery\n💝 Personalized options available\n❤️ 100% customer satisfaction\n\n'Enfolding Your Emotions...' - Hum aapke emotions ko perfect gift me convert karte hain!\n\nMain Gift Buddy - aapka personal gift assistant! Always here to help! 😊🎉"
    }

    // Customization
    if (lowerQuery.includes("custom") || lowerQuery.includes("personalize") || lowerQuery.includes("name") || lowerQuery.includes("photo")) {
      return "✨ Customization:\n• Add name/message on gifts\n• Photo printing available\n• Custom designs possible\n• Personalized packaging\n• WhatsApp pe details discuss karein!"
    }

    // Best sellers
    if (lowerQuery.includes("best") || lowerQuery.includes("popular") || lowerQuery.includes("top") || lowerQuery.includes("trending")) {
      const featured = products.filter(p => p.isFeatured).slice(0, 3)
      if (featured.length > 0) {
        return `⭐ Gift Buddy's Best Sellers (Customer Favorites!):\n\n${featured.map(p => `🎁 ${p.name} - ₹${p.sizes ? p.sizes[0].price : p.price}`).join("\n")}\n\n✨ Ye sabse zyada bikne wale gifts hain!\nGift Buddy recommends these! 😊`
      }
    }

    // New arrivals
    if (lowerQuery.includes("new") || lowerQuery.includes("latest") || lowerQuery.includes("recent")) {
      const newItems = products.filter(p => p.isNewArrival).slice(0, 3)
      if (newItems.length > 0) {
        return `🆕 Gift Buddy's Fresh Arrivals (Just In!):\n\n${newItems.map(p => `✨ ${p.name} - ₹${p.sizes ? p.sizes[0].price : p.price}`).join("\n")}\n\n🎉 Ye brand new products hain!\nGift Buddy exclusive picks! Check karein! 😊`
      }
    }

    // Specific product search
    const productSearch = searchProducts(products, query)
    if (productSearch.length > 0 && (lowerQuery.includes("chahiye") || lowerQuery.includes("dikhao") || lowerQuery.includes("show"))) {
      const foundProducts = productSearch.slice(0, 4)
      return {
        text: `Found ${foundProducts.length} products! 👇`,
        products: foundProducts,
      }
    }

    return null
  }

  // Smart response handler
  const handleUserMessage = (text: string) => {
    const lowerText = text.toLowerCase().trim()

    // Check if out of scope
    const outOfScopeKeywords = [
      "weather", "mausam", "time", "samay", "news", "samachar",
      "cricket", "movie", "film", "politics", "rajniti",
      "sports", "khel", "stock", "share", "bitcoin", "crypto"
    ]

    if (outOfScopeKeywords.some(keyword => lowerText.includes(keyword))) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const declineMsg: ChatMessage = {
          text: "Sorry 😅 Main sirf Gift Choice website aur gifts ke baare mein help kar sakta hoon. Website se related koi sawaal ho to zaroor pucho!",
          sender: "bot",
          id: getUniqueId(),
        }
        setMessages((prev) => [...prev, declineMsg])
      }, 800)
      return
    }

    // Check website knowledge base first
    const websiteInfo = getWebsiteInfo(text)
    if (websiteInfo) {
      setMood("thinking")
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMood("happy")
        if (typeof websiteInfo === "string") {
          // Use first enthusiasm to avoid random mismatch
          const enthusiasm = giftBuddyPersonality.enthusiasm[0]
          const infoMsg: ChatMessage = {
            text: `${enthusiasm}\n\n${websiteInfo}`,
            sender: "bot",
            id: getUniqueId(),
          }
          setMessages((prev) => [...prev, infoMsg])
        } else {
          // Product search result
          setShowSparkles(true)
          // Use first found message to avoid random mismatch
          const found = giftBuddyPersonality.found[0]
          const productMsg: ChatMessage = {
            text: `${found}\n\n${websiteInfo.text}`,
            sender: "bot",
            id: getUniqueId(),
            products: websiteInfo.products,
          }
          setMessages((prev) => [...prev, productMsg])
          setChatState("suggestion")
        }
      }, 1000)
      return
    }

    // Extract information from user message
    const occasionKeywords: Record<string, string> = {
      birthday: "🎂 Birthday",
      janamdin: "🎂 Birthday",
      anniversary: "❤️ Anniversary",
      baby: "👶 Baby / New Born",
      wedding: "💍 Wedding",
      shadi: "💍 Wedding",
      general: "🎁 General Gift",
    }

    const recipientKeywords: Record<string, string> = {
      him: "👨 For Him",
      male: "👨 For Him",
      ladka: "👨 For Him",
      her: "👩 For Her",
      female: "👩 For Her",
      ladki: "👩 For Her",
      baby: "👶 For Baby",
      bachcha: "👶 For Baby",
      couple: "👨‍👩‍👧 Couple",
      jodi: "👨‍👩‍👧 Couple",
    }

    // Smart budget extraction - "ke andar" = under that amount
    let extractedBudget: number | null = null
    const budgetMatch = lowerText.match(/(\d+)/)
    if (budgetMatch) {
      const budgetNum = parseInt(budgetMatch[1])
      if (budgetNum > 0 && budgetNum < 100000) { // Reasonable range
        extractedBudget = budgetNum
      }
    }

    // Check if user said "ke andar" or "under" or "tak"
    const isUnderBudget = lowerText.includes("andar") || lowerText.includes("under") || lowerText.includes("tak") || lowerText.includes("se kam")

    // Map extracted budget to budget range
    const budgetKeywords: Record<string, string> = {
      "499": "Under ₹499",
      "500": "₹500 – ₹999",
      "999": "₹500 – ₹999",
      "1000": "₹1000 – ₹1999",
      "1999": "₹1000 – ₹1999",
      "2000": "₹2000+",
    }

    // Update context
    let updatedContext = { ...conversationContext }
    let shouldSearch = false

    for (const [key, value] of Object.entries(occasionKeywords)) {
      if (lowerText.includes(key)) {
        updatedContext.occasion = value
        shouldSearch = true
      }
    }

    for (const [key, value] of Object.entries(recipientKeywords)) {
      if (lowerText.includes(key)) {
        updatedContext.recipient = value
        shouldSearch = true
      }
    }

    // Smart budget detection - "ke andar" = under that amount (0 to that number)
    if (extractedBudget !== null && isUnderBudget) {
      // "500 ke andar" = 0 to 500, "1000 ke andar" = 0 to 1000
      updatedContext.budget = `Under ₹${extractedBudget}`
      shouldSearch = true
    } else if (extractedBudget !== null) {
      // If no "ke andar", use range logic
      if (extractedBudget <= 499) {
        updatedContext.budget = "Under ₹499"
      } else if (extractedBudget <= 999) {
        updatedContext.budget = "₹500 – ₹999"
      } else if (extractedBudget <= 1999) {
        updatedContext.budget = "₹1000 – ₹1999"
      } else {
        updatedContext.budget = "₹2000+"
      }
      shouldSearch = true
    } else {
      // Fallback to keyword matching
      for (const [key, value] of Object.entries(budgetKeywords)) {
        if (lowerText.includes(key)) {
          updatedContext.budget = value
          shouldSearch = true
          break
        }
      }
    }

    // Add preferences
    const preferenceKeywords = ["personalized", "photo", "name", "message", "custom"]
    preferenceKeywords.forEach(keyword => {
      if (lowerText.includes(keyword) && !updatedContext.preferences.includes(keyword)) {
        updatedContext.preferences.push(keyword)
      }
    })

    setConversationContext(updatedContext)

    // Add user message
    const userMsg: ChatMessage = {
      text: text,
      sender: "user",
      id: getUniqueId(),
    }
    setMessages((prev) => [...prev, userMsg])

    // Bot response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)

      // If enough info, show products
      if (shouldSearch && (updatedContext.occasion || updatedContext.recipient || updatedContext.budget)) {
        setMood("thinking")
        // Use first thinking message to avoid random mismatch
        const thinking = giftBuddyPersonality.thinking[0]
        const thinkingMsg: ChatMessage = {
          text: thinking,
          sender: "bot",
          id: getUniqueId(),
        }
        setMessages((prev) => [...prev, thinkingMsg])
        
        setTimeout(() => {
          setMood("excited")
          setShowSparkles(true)
          const suggestedProducts = getSuggestedProducts(updatedContext)
          // Use first found message to avoid random mismatch
          const found = giftBuddyPersonality.found[0]
          
          // Smart salesman message with budget verification
          let suggestionText = found
          if (suggestedProducts.length > 0) {
            // Verify all products are within budget
            if (updatedContext.budget) {
              // Check if it's "Under ₹X" format (from "ke andar")
              const underMatch = updatedContext.budget.match(/Under ₹(\d+)/)
              let allInBudget = false
              
              if (underMatch) {
                // "500 ke andar" = 0 to 500, "1000 ke andar" = 0 to 1000
                const maxBudget = parseInt(underMatch[1])
                allInBudget = suggestedProducts.every(p => {
                  const minPrice = p.sizes ? Math.min(...p.sizes.map(s => s.price)) : p.price
                  return minPrice >= 0 && minPrice <= maxBudget
                })
                
                if (allInBudget) {
                  suggestionText += `\n\n✅ ₹${maxBudget} ke andar ye ${suggestedProducts.length} best options hain:\n\n`
                } else {
                  suggestionText += `\n\n⚠️ ₹${maxBudget} ke andar ye options hain (kuch thode upar bhi hain):\n\n`
                }
              } else {
                // Use range logic for predefined ranges
                const budgetRanges: Record<string, [number, number]> = {
                  "Under ₹499": [0, 499],
                  "₹500 – ₹999": [500, 999],
                  "₹1000 – ₹1999": [1000, 1999],
                  "₹2000+": [2000, 10000],
                }
                const range = budgetRanges[updatedContext.budget]
                if (range) {
                  allInBudget = suggestedProducts.every(p => {
                    const minPrice = p.sizes ? Math.min(...p.sizes.map(s => s.price)) : p.price
                    return minPrice >= range[0] && minPrice <= range[1]
                  })
                  
                  if (allInBudget) {
                    suggestionText += `\n\n✅ Aapke budget (${updatedContext.budget}) ke andar ye ${suggestedProducts.length} best options hain:\n\n`
                  } else {
                    suggestionText += `\n\n⚠️ Aapke budget ke hisaab se ye options hain (kuch thode upar bhi hain):\n\n`
                  }
                } else {
                  suggestionText += `\n\n✨ Ye ${suggestedProducts.length} best options hain:\n\n`
                }
              }
              
              // Add product list
              suggestedProducts.forEach((p, idx) => {
                const minPrice = p.sizes ? Math.min(...p.sizes.map(s => s.price)) : p.price
                suggestionText += `${idx + 1}. ${p.name} - ₹${minPrice}\n`
              })
              
              if (!allInBudget) {
                suggestionText += "\n\n💡 Budget thoda badha sakte hain? Ya WhatsApp pe baat karein!"
              } else {
                suggestionText += "\n\n💬 Inme se koi pasand aaya? Ya WhatsApp pe baat karein!"
              }
            } else {
              suggestionText += `\n\n✨ Ye ${suggestedProducts.length} best options hain:\n\n`
              suggestedProducts.forEach((p, idx) => {
                const minPrice = p.sizes ? Math.min(...p.sizes.map(s => s.price)) : p.price
                suggestionText += `${idx + 1}. ${p.name} - ₹${minPrice}\n`
              })
            }
          } else {
            suggestionText += "\n\n😅 Is budget me exact match nahi mila.\n\nKya aap budget thoda badha sakte hain? Ya WhatsApp pe baat karein, main aapke liye perfect gift dhoondh dunga! 💬"
          }
          
          const suggestionMsg: ChatMessage = {
            text: suggestionText,
            sender: "bot",
            id: getUniqueId(),
            products: suggestedProducts,
          }
          setMessages((prev) => [...prev, suggestionMsg])
          setChatState("suggestion")
          setMood("happy")
        }, 1500)
      } else {
        // Ask follow-up questions
        let followUp = ""
        if (!updatedContext.occasion) {
          followUp = "Kis occasion ke liye gift chahiye? (Birthday, Anniversary, etc.)"
        } else if (!updatedContext.recipient) {
          followUp = "Gift kis ke liye hai? (Him, Her, Baby, Couple)"
        } else if (!updatedContext.budget) {
          followUp = "Budget kitna hai? (Under ₹499, ₹500-999, etc.)"
        } else {
          followUp = "Aur koi specific requirement hai? (Personalized, Photo frame, etc.)"
        }

        const followUpMsg: ChatMessage = {
          text: followUp,
          sender: "bot",
            id: getUniqueId(),
        }
        setMessages((prev) => [...prev, followUpMsg])
      }
    }, 1000)
  }

  // Smart product search based on context
  const getSuggestedProducts = (context: typeof conversationContext): Product[] => {
    let filtered = [...products]

    // Search by occasion keywords
    if (context.occasion) {
      const occasionMap: Record<string, string[]> = {
        "🎂 Birthday": ["birthday", "bday", "cake"],
        "❤️ Anniversary": ["anniversary", "couple", "love"],
        "👶 Baby / New Born": ["baby", "newborn", "infant"],
        "💍 Wedding": ["wedding", "marriage", "bridal"],
      }
      const keywords = occasionMap[context.occasion] || []
      if (keywords.length > 0) {
        filtered = searchProducts(filtered, keywords.join(" "))
      }
    }

    // Filter by category based on recipient
    if (context.recipient) {
      const recipientMap: Record<string, string[]> = {
        "👨 For Him": ["bottle", "water", "personalized"],
        "👩 For Her": ["bottle", "photo", "frame", "personalized"],
        "👶 For Baby": ["soft", "toy", "plush", "teddy"],
        "👨‍👩‍👧 Couple": ["photo", "frame", "anniversary", "personalized"],
      }
      const keywords = recipientMap[context.recipient] || []
      if (keywords.length > 0) {
        filtered = searchProducts(filtered, keywords.join(" "))
      }
    }

    // Filter by budget - "ke andar" = under that amount (0 to that number)
    if (context.budget) {
      // Check if it's "Under ₹X" format (from "ke andar")
      const underMatch = context.budget.match(/Under ₹(\d+)/)
      if (underMatch) {
        const maxBudget = parseInt(underMatch[1])
        // "500 ke andar" = 0 to 500, "1000 ke andar" = 0 to 1000
        filtered = filtered.filter((p) => {
          let minPrice = p.price
          if (p.sizes && p.sizes.length > 0) {
            minPrice = Math.min(...p.sizes.map(s => s.price))
          }
          // Product must be under the specified amount (0 to maxBudget)
          return minPrice >= 0 && minPrice <= maxBudget
        })
      } else {
        // Use range logic for predefined ranges
        const budgetRanges: Record<string, [number, number]> = {
          "Under ₹499": [0, 499],
          "₹500 – ₹999": [500, 999],
          "₹1000 – ₹1999": [1000, 1999],
          "₹2000+": [2000, 10000],
        }
        const range = budgetRanges[context.budget]
        if (range) {
          // STRICT: Only show products within budget range
          filtered = filtered.filter((p) => {
            let minPrice = p.price
            if (p.sizes && p.sizes.length > 0) {
              minPrice = Math.min(...p.sizes.map(s => s.price))
            }
            // Product must be within budget range (strict check)
            return minPrice >= range[0] && minPrice <= range[1]
          })
        }
      }
      
      // If no products found, try to find closest alternatives (sales tactic)
      if (filtered.length === 0) {
        let alternativeRange: [number, number] = [0, 10000]
        if (underMatch) {
          const maxBudget = parseInt(underMatch[1])
          alternativeRange = [0, maxBudget + 100] // Allow 100 more
        } else {
          const budgetRanges: Record<string, [number, number]> = {
            "Under ₹499": [0, 599],
            "₹500 – ₹999": [500, 1099],
            "₹1000 – ₹1999": [1000, 2099],
            "₹2000+": [2000, 10000],
          }
          const range = budgetRanges[context.budget]
          if (range) {
            alternativeRange = [range[0], range[1] + 100]
          }
        }
        
        const alternatives = products.filter((p) => {
          let minPrice = p.price
          if (p.sizes && p.sizes.length > 0) {
            minPrice = Math.min(...p.sizes.map(s => s.price))
          }
          return minPrice >= alternativeRange[0] && minPrice <= alternativeRange[1]
        })
        if (alternatives.length > 0) {
          filtered = alternatives.slice(0, 3)
        }
      }
    }

    // Smart sorting: Featured first, then by price (ascending for budget-conscious customers)
    filtered.sort((a, b) => {
      // Featured products first (best sellers)
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      
      // Then by price (lower first for budget-conscious)
      const priceA = a.sizes ? Math.min(...a.sizes.map(s => s.price)) : a.price
      const priceB = b.sizes ? Math.min(...b.sizes.map(s => s.price)) : b.price
      return priceA - priceB
    })

    // Filter by preferences
    if (context.preferences.length > 0) {
      if (context.preferences.includes("personalized") || context.preferences.includes("custom")) {
        filtered = filtered.filter((p) => p.name.toLowerCase().includes("personalized") || p.description.toLowerCase().includes("personalized"))
      }
      if (context.preferences.includes("photo") || context.preferences.includes("frame")) {
        filtered = filtered.filter((p) => p.category === "photo-frames" || p.name.toLowerCase().includes("photo") || p.name.toLowerCase().includes("frame"))
      }
    }

    return filtered.slice(0, 4) // Show top 4 products
  }

  const handleSend = () => {
    if (!userInput.trim()) return

    handleUserMessage(userInput)
    setUserInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleButtonClick = (buttonText: string) => {
    if (buttonText === "📞 Direct WhatsApp" || buttonText === "💬 WhatsApp Now") {
      handleWhatsAppRedirect()
      return
    }

    if (chatState === "intro") {
      if (buttonText === "Haan, help chahiye! 🎉") {
        setMood("excited")
        setShowSparkles(true)
        setChatState("conversation")
        setTimeout(() => {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            setMood("happy")
            const welcomeMsg: ChatMessage = {
              text: "Yay! 🎊 Main excited hoon!\n\nBatao, aapko kya chahiye? Main aapke liye perfect gift dhoondh dunga! ✨",
              sender: "bot",
              id: getUniqueId(),
            }
            setMessages((prev) => [...prev, welcomeMsg])
          }, 800)
        }, 500)
      } else {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const laterMsg: ChatMessage = {
            text: "Koi baat nahi! Jab ready ho to WhatsApp pe message kar dena 👍",
            buttons: ["💬 WhatsApp Now"],
            sender: "bot",
            id: getUniqueId(),
          }
          setMessages((prev) => [...prev, laterMsg])
        }, 800)
      }
    }
  }

  const handleWhatsAppRedirect = () => {
    const message = `Hi! Gift Choice se contact kar raha hoon.\n\nOccasion: ${conversationContext.occasion || "Not selected"}\nRecipient: ${conversationContext.recipient || "Not selected"}\nBudget: ${conversationContext.budget || "Not selected"}\n\nHelp chahiye gift choose karne me.`
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  // Backup message if user is inactive (client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return
    if (isOpen && messages.length > 0 && chatState !== "whatsapp" && chatState !== "hidden") {
      const inactiveTimer = setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const backupMsg: ChatMessage = {
            text: "Confused ho? 😄\nWhatsApp pe bol do, main simple language me samjha dunga",
            buttons: ["💬 WhatsApp Now"],
            sender: "bot",
            id: getUniqueId(),
          }
          setMessages((prev) => [...prev, backupMsg])
        }, 800)
      }, 35000)

      return () => clearTimeout(inactiveTimer)
    }
  }, [isOpen, messages.length, chatState, isMounted])

  const handleOpen = () => {
    if (!isMounted || typeof window === "undefined") return
    setIsOpen(true)
    setChatState("namaste")
    setHasStarted(true)
    setMessages([])
    setConversationContext({ occasion: "", recipient: "", budget: "", preferences: [] })
  }

  // Don't render until mounted (prevents hydration mismatch)
  // Return empty div instead of null to maintain consistent structure
  if (!isMounted) {
    return <div style={{ display: 'none' }} aria-hidden="true" />
  }

  if (chatState === "hidden") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpen}
          className="h-20 w-20 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center overflow-hidden group relative"
          aria-label="Open Gift Buddy Chatbot"
          style={{ background: 'transparent' }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors animate-pulse"></div>
          {/* Outer ring animation */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          
          {/* 3D Avatar */}
          <div className="w-full h-full relative z-10">
            <Chatbot3DAvatar 
              modelPath="/chatbot-avatar.fbx" 
              isOpen={false} 
              mood={mood}
            />
          </div>
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Chatbot Button - Right Corner Fixed with 3D Avatar */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleOpen}
            className="h-20 w-20 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center overflow-hidden group relative"
            aria-label="Open Gift Buddy Chatbot"
            style={{ background: 'transparent' }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors animate-pulse"></div>
            {/* Outer ring animation */}
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
            
            {/* 3D Avatar */}
            <div className="w-full h-full relative z-10">
              <Chatbot3DAvatar 
                modelPath="/chatbot-avatar.fbx" 
                isOpen={false} 
                mood={mood}
              />
            </div>
          </button>
        </div>
      )}

      {/* Chatbot Window - Right Corner Fixed */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[600px] bg-background border-2 border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header with Avatar - Special Design */}
          <div className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground p-4 flex items-center justify-between rounded-t-2xl relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div
                ref={avatarRef}
                className={`h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden relative shadow-2xl border-2 ${
                  mood === "excited" ? "border-yellow-400 animate-pulse" : 
                  mood === "thinking" ? "border-blue-400" : 
                  "border-primary-foreground/30"
                } transition-all duration-300`}
              >
                {/* 3D Avatar */}
                <div className="w-full h-full">
                  <Chatbot3DAvatar 
                    modelPath="/chatbot-avatar.fbx" 
                    isOpen={isOpen} 
                    mood={mood}
                  />
                </div>
                {isTyping && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-primary animate-ping shadow-lg"></div>
                )}
                {mood === "excited" && (
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Gift Buddy</h3>
                  <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  Your Gift Assistant
                </p>
              </div>
            </div>
            
            {/* Sparkles effect */}
            {showSparkles && (
              <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="sparkle absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsOpen(false)
                setChatState("hidden")
                setHasStarted(false)
                setMessages([])
                setConversationContext({ occasion: "", recipient: "", budget: "", preferences: [] })
              }}
              className="h-9 w-9 rounded-full hover:bg-primary-foreground/30 bg-primary-foreground/10 flex items-center justify-center transition-all hover:scale-110 z-20 relative cursor-pointer"
              aria-label="Close Gift Buddy"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                ref={(el) => {
                  if (el) messageRefs.current.set(msg.id, el)
                }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                      : "bg-gradient-to-br from-secondary to-secondary/80 text-foreground border border-primary/10"
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                  
                  {/* Gift Buddy Signature */}
                  {msg.sender === "bot" && !msg.products && (
                    <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                      <Heart className="h-3 w-3 text-pink-400" />
                      <span>— Gift Buddy</span>
                    </div>
                  )}
                  
                  {/* Product Cards - Special Design */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                        <Sparkles className="h-3 w-3" />
                        <span>Gift Buddy's Special Picks ✨</span>
                      </div>
                      {msg.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="block p-3 bg-background rounded-xl border-2 border-primary/20 hover:border-primary hover:shadow-lg transition-all group"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex gap-3">
                            <div className="relative">
                              <img
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                              />
                              {product.isFeatured && (
                                <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                  ⭐
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold group-hover:text-primary transition-colors">{product.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{product.description?.substring(0, 50)}...</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-sm font-bold text-primary">₹{product.sizes ? product.sizes[0].price : product.price}</p>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">View →</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.buttons.map((btn, btnIndex) => (
                        <button
                          key={btnIndex}
                          onClick={() => handleButtonClick(btn)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                            msg.sender === "user"
                              ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                              : "bg-background hover:bg-background/80 text-foreground border border-border hover:border-primary"
                          }`}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator - Special Design */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-secondary to-secondary/80 text-foreground rounded-2xl p-4 border border-primary/20 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">Gift Buddy thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Special Design */}
          {chatState === "conversation" || chatState === "suggestion" ? (
            <div className="p-4 border-t border-border bg-gradient-to-r from-secondary/80 to-secondary/50">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Gift Buddy se baat karein... 💬"
                    className="pr-10 bg-background border-primary/20 focus:border-primary"
                  />
                  <Gift className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all hover:scale-110"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                💡 Tip: "Birthday gift ₹500 mein" ya "Best sellers dikhao" type karein
              </p>
            </div>
          ) : (
            <div className="p-4 border-t border-border bg-gradient-to-r from-green-600/10 to-green-500/10">
              <Button 
                onClick={handleWhatsAppRedirect} 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp pe Direct Connect
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Gift Buddy WhatsApp pe bhi available hai! 📱
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
