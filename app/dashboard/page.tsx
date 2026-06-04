"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Plus,
  Eye,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { TopNavigation } from "@/components/top-navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function Dashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleViewAnalytics = () => {
    const section = document.getElementById("analytics-section")
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  const stats = [
    {
      title: t.totalCustomers,
      value: "60",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: t.totalProducts,
      value: "50",
      change: "+8%",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: t.totalOrders,
      value: "234",
      change: "+23%",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      title: t.revenue,
      value: "$45,678",
      change: "+15%",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
  ]

  const recentOrders = [
    { id: "ORD-001", customer: "Alisher Karimov", amount: "$1,234", status: "completed", date: "2024-01-15" },
    { id: "ORD-002", customer: "Malika Tosheva", amount: "$856", status: "pending", date: "2024-01-14" },
    { id: "ORD-003", customer: "Bobur Rahimov", amount: "$2,100", status: "processing", date: "2024-01-13" },
    { id: "ORD-004", customer: "Nilufar Saidova", amount: "$675", status: "completed", date: "2024-01-12" },
  ]

  const quickActions = [
    {
      title: t.products,
      description: "Manage your product inventory",
      icon: Package,
      href: "/products",
      color: "from-blue-500 to-cyan-500",
      count: "50 items",
    },
    {
      title: t.customers,
      description: "View and manage customers",
      icon: Users,
      href: "/customers",
      color: "from-green-500 to-emerald-500",
      count: "60 customers",
    },
    {
      title: t.orders,
      description: "Track and process orders",
      icon: ShoppingCart,
      href: "/orders",
      color: "from-purple-500 to-pink-500",
      count: "234 orders",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
            <p className="text-xl opacity-90 mb-8">Manage your wholesale fashion business efficiently</p>
            <div className="flex justify-center space-x-4">
              <Button
                className="bg-white text-indigo-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                onClick={() => router.push("/products")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600 dark:border-white dark:text-white dark:hover:bg-white/10"
                onClick={handleViewAnalytics}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              {/* <ThemeToggle
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600"
                showLabel={false}
              /> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-lg transition-all duration-300 dark:bg-opacity-20`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-1">
                      {stat.change} {t.fromLastMonth}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group dark:bg-gray-800 dark:border-gray-700"
                >
                  <Link href={action.href}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}
                          >
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{action.count}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Analytics Card */}
            <div id="analytics-section" className="mt-6 rounded-lg overflow-hidden">
              <div className="relative bg-purple-500 p-6 text-white">
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
                  <p className="text-sm opacity-90 mb-4">Get detailed insights about your business performance</p>
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    <Activity className="w-4 h-4 mr-2" />
                    Open Analytics
                  </Button>
                </div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
                
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="h-fit dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">{t.recentOrders}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {t.latestOrderActivity}
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                    <Link href="/orders">
                      <Eye className="w-4 h-4 mr-2" />
                      {t.viewAll}
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{order.id.slice(-2)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300"
                          }
                        >
                          {order.status}
                        </Badge>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
