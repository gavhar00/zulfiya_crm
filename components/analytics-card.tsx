"use client"

import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import Image from "next/image"

export function AnalyticsCard() {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="relative">
        <Image src="/images/analytics-bg.png" alt="Analytics background" width={400} height={200} className="w-full" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">View Analytics</h3>
            <p className="text-sm text-white/90">Get detailed insights about your business performance</p>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 w-fit">
            <Activity className="w-4 h-4 mr-2" />
            Open Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}
