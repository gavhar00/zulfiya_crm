"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Edit, Trash2, Filter, Grid3X3, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/hooks/use-language"
import { useNotifications } from "@/hooks/use-notifications"
import { TopNavigation } from "@/components/top-navigation"
import * as XLSX from "xlsx"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  status: "active" | "inactive"
}

export default function ProductsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterCategory, setFilterCategory] = useState("all")
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    status: "active" as const,
  })

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      loadProducts()
    }
  }, [router])

  const loadProducts = () => {
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Initialize with sample products
      const sampleProducts: Product[] = [
        {
          id: "1",
          name: "Cotton T-Shirt",
          category: "T-Shirts",
          price: 15.99,
          stock: 150,
          description: "High quality cotton t-shirt",
          status: "active",
        },
        {
          id: "2",
          name: "Denim Jeans",
          category: "Jeans",
          price: 45.99,
          stock: 80,
          description: "Classic blue denim jeans",
          status: "active",
        },
        {
          id: "3",
          name: "Summer Dress",
          category: "Dresses",
          price: 35.99,
          stock: 60,
          description: "Light summer dress",
          status: "active",
        },
        {
          id: "4",
          name: "Wool Sweater",
          category: "Sweaters",
          price: 55.99,
          stock: 40,
          description: "Warm wool sweater",
          status: "active",
        },
        {
          id: "5",
          name: "Leather Jacket",
          category: "Jackets",
          price: 120.99,
          stock: 25,
          description: "Premium leather jacket",
          status: "active",
        },
        // Add more sample products to reach 50
        ...Array.from({ length: 45 }, (_, i) => ({
          id: (i + 6).toString(),
          name: `Product ${i + 6}`,
          category: ["T-Shirts", "Jeans", "Dresses", "Sweaters", "Jackets"][i % 5],
          price: Math.floor(Math.random() * 100) + 10,
          stock: Math.floor(Math.random() * 200) + 10,
          description: `Description for product ${i + 6}`,
          status: "active" as const,
        })),
      ]
      setProducts(sampleProducts)
      localStorage.setItem("products", JSON.stringify(sampleProducts))
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields")
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      description: newProduct.description,
      status: newProduct.status,
    }

    const updatedProducts = [...products, product]
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Add notification
    addNotification({
      title: "Product Added",
      message: `${product.name} has been added to inventory`,
      type: "success",
    })

    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      status: "active",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      status: product.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct || !newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields")
      return
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      description: newProduct.description,
      status: newProduct.status,
    }

    const updatedProducts = products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Add notification
    addNotification({
      title: "Product Updated",
      message: `${updatedProduct.name} has been updated`,
      type: "success",
    })

    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      status: "active",
    })
    setEditingProduct(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    const productToDelete = products.find((p) => p.id === id)
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Add notification
    if (productToDelete) {
      addNotification({
        title: "Product Deleted",
        message: `${productToDelete.name} has been removed from inventory`,
        type: "warning",
      })
    }
  }

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(products)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Create blob and download
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = "products.xlsx"
      link.click()
      window.URL.revokeObjectURL(url)

      // Add notification
      addNotification({
        title: "Export Successful",
        message: "Products data has been exported to Excel",
        type: "success",
      })
    } catch (error) {
      console.error("Export failed:", error)
      addNotification({
        title: "Export Failed",
        message: "Failed to export products data",
        type: "error",
      })
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === "all" || product.category === filterCategory),
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />

      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.products}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your product inventory</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={exportToExcel} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                {t.export}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addProduct}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">{t.addNewProduct}</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">{t.fillProductDetails}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="dark:text-gray-300">
                        {t.productName}
                      </Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="dark:text-gray-300">
                        {t.category}
                      </Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder={t.selectCategory} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                          <SelectItem value="Jeans">Jeans</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Sweaters">Sweaters</SelectItem>
                          <SelectItem value="Jackets">Jackets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price" className="dark:text-gray-300">
                          {t.price}
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock" className="dark:text-gray-300">
                          {t.stock}
                        </Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="dark:text-gray-300">
                        {t.description}
                      </Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        {t.cancel}
                      </Button>
                      <Button onClick={handleAddProduct}>{t.addProduct}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Edit Product</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">Update product details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name" className="dark:text-gray-300">
                        {t.productName}
                      </Label>
                      <Input
                        id="edit-name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category" className="dark:text-gray-300">
                        {t.category}
                      </Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder={t.selectCategory} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                          <SelectItem value="Jeans">Jeans</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Sweaters">Sweaters</SelectItem>
                          <SelectItem value="Jackets">Jackets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-price" className="dark:text-gray-300">
                          {t.price}
                        </Label>
                        <Input
                          id="edit-price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-stock" className="dark:text-gray-300">
                          {t.stock}
                        </Label>
                        <Input
                          id="edit-stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-description" className="dark:text-gray-300">
                        {t.description}
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        {t.cancel}
                      </Button>
                      <Button onClick={handleUpdateProduct}>Update Product</Button>
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
                placeholder={t.searchProducts}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="T-Shirts">T-Shirts</SelectItem>
              <SelectItem value="Jeans">Jeans</SelectItem>
              <SelectItem value="Dresses">Dresses</SelectItem>
              <SelectItem value="Sweaters">Sweaters</SelectItem>
              <SelectItem value="Jackets">Jackets</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none dark:text-gray-300"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none dark:text-gray-300"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1 dark:text-white">{product.name}</CardTitle>
                    <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                      {product.category}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 dark:text-gray-400">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {t.stock}: {product.stock}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 dark:border-gray-600 dark:text-gray-300"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {t.edit}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{product.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${product.price}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{product.stock}</td>
                      <td className="px-6 py-4">
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
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
