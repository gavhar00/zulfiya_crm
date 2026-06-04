"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Edit, Trash2, Calendar, DollarSign, Filter, Grid3X3, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/hooks/use-language"
import { TopNavigation } from "@/components/top-navigation"
import * as XLSX from "xlsx"

interface Order {
  id: string
  customerId: string
  customerName: string
  products: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  orderDate: string
  deliveryDate?: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState("all")
  const [newOrder, setNewOrder] = useState({
    customerId: "",
    productId: "",
    quantity: "1",
    status: "pending" as const,
  })

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      loadOrders()
      loadCustomers()
      loadProducts()
    }
  }, [router])

  const loadOrders = () => {
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      // Initialize with sample orders
      const sampleOrders: Order[] = [
        {
          id: "ORD-001",
          customerId: "1",
          customerName: "Alisher Karimov",
          products: [
            { id: "1", name: "Cotton T-Shirt", quantity: 5, price: 15.99 },
            { id: "2", name: "Denim Jeans", quantity: 2, price: 45.99 },
          ],
          total: 171.93,
          status: "completed",
          orderDate: "2024-01-15",
          deliveryDate: "2024-01-20",
        },
        {
          id: "ORD-002",
          customerId: "2",
          customerName: "Malika Tosheva",
          products: [{ id: "3", name: "Summer Dress", quantity: 3, price: 35.99 }],
          total: 107.97,
          status: "pending",
          orderDate: "2024-01-14",
        },
        {
          id: "ORD-003",
          customerId: "3",
          customerName: "Bobur Rahimov",
          products: [
            { id: "4", name: "Wool Sweater", quantity: 1, price: 55.99 },
            { id: "5", name: "Leather Jacket", quantity: 1, price: 120.99 },
          ],
          total: 176.98,
          status: "processing",
          orderDate: "2024-01-13",
        },
      ]

      setOrders(sampleOrders)
      localStorage.setItem("orders", JSON.stringify(sampleOrders))
    }
  }

  const loadCustomers = () => {
    const savedCustomers = localStorage.getItem("customers")
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    }
  }

  const loadProducts = () => {
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }

  const handleAddOrder = () => {
    if (!newOrder.customerId || !newOrder.productId || !newOrder.quantity) {
      alert("Please fill in all required fields")
      return
    }

    const customer = customers.find((c) => c.id === newOrder.customerId)
    const product = products.find((p) => p.id === newOrder.productId)

    if (!customer || !product) {
      alert("Invalid customer or product selected")
      return
    }

    const order: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      customerId: newOrder.customerId,
      customerName: customer.name,
      products: [
        {
          id: product.id,
          name: product.name,
          quantity: Number.parseInt(newOrder.quantity),
          price: product.price,
        },
      ],
      total: product.price * Number.parseInt(newOrder.quantity),
      status: newOrder.status,
      orderDate: new Date().toISOString().split("T")[0],
    }

    const updatedOrders = [...orders, order]
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    setNewOrder({
      customerId: "",
      productId: "",
      quantity: "1",
      status: "pending",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteOrder = (id: string) => {
    const updatedOrders = orders.filter((o) => o.id !== id)
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const exportToExcel = () => {
    try {
      const exportData = orders.map((order) => ({
        "Order ID": order.id,
        Customer: order.customerName,
        Products: order.products.map((p) => `${p.name} (${p.quantity})`).join(", "),
        Total: order.total,
        Status: order.status,
        "Order Date": order.orderDate,
        "Delivery Date": order.deliveryDate || "N/A",
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders")

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Create blob and download
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = "orders.xlsx"
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || order.status === filterStatus),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />

      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.orders}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage your orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={exportToExcel} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                {t.export}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addOrder}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t.addNewOrder}</DialogTitle>
                    <DialogDescription>{t.fillOrderDetails}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer">{t.customer}</Label>
                      <Select
                        value={newOrder.customerId}
                        onValueChange={(value) => setNewOrder({ ...newOrder, customerId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectCustomer} />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="product">{t.product}</Label>
                      <Select
                        value={newOrder.productId}
                        onValueChange={(value) => setNewOrder({ ...newOrder, productId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectProduct} />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">{t.quantity}</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={newOrder.quantity}
                        onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">{t.status}</Label>
                      <Select
                        value={newOrder.status}
                        onValueChange={(value: any) => setNewOrder({ ...newOrder, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        {t.cancel}
                      </Button>
                      <Button onClick={handleAddOrder}>{t.addOrder}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t.searchOrders}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Orders Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <CardDescription className="text-gray-600">{order.customerName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{order.orderDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">{t.products}:</p>
                      {order.products.map((product, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {product.name} x{product.quantity}
                        </p>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        {t.edit}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.products.map((p, i) => (
                            <div key={i}>
                              {p.name} x{p.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.orderDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
