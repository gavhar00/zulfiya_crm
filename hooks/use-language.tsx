"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Language = "en" | "uz" | "ru"

interface Translations {
  // Navigation
  dashboard: string
  products: string
  customers: string
  orders: string
  logout: string

  // Common
  search: string
  add: string
  edit: string
  delete: string
  cancel: string
  save: string
  export: string
  viewAll: string

  // Dashboard
  totalCustomers: string
  totalProducts: string
  totalOrders: string
  revenue: string
  fromLastMonth: string
  recentOrders: string
  latestOrderActivity: string
  addProduct: string
  addNewProduct: string
  addCustomer: string
  addNewCustomer: string
  exportData: string
  downloadReports: string

  // Products
  searchProducts: string
  productName: string
  category: string
  selectCategory: string
  price: string
  stock: string
  description: string
  status: string
  fillProductDetails: string

  // Customers
  searchCustomers: string
  customerName: string
  email: string
  phone: string
  address: string
  totalSpent: string
  fillCustomerDetails: string

  // Orders
  searchOrders: string
  addOrder: string
  addNewOrder: string
  fillOrderDetails: string
  customer: string
  selectCustomer: string
  product: string
  selectProduct: string
  quantity: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    products: "Products",
    customers: "Customers",
    orders: "Orders",
    logout: "Logout",

    // Common
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    export: "Export",
    viewAll: "View All",

    // Dashboard
    totalCustomers: "Total Customers",
    totalProducts: "Total Products",
    totalOrders: "Total Orders",
    revenue: "Revenue",
    fromLastMonth: "from last month",
    recentOrders: "Recent Orders",
    latestOrderActivity: "Latest order activity",
    addProduct: "Add Product",
    addNewProduct: "Add new product to inventory",
    addCustomer: "Add Customer",
    addNewCustomer: "Add new customer to database",
    exportData: "Export Data",
    downloadReports: "Download reports and analytics",

    // Products
    searchProducts: "Search products...",
    productName: "Product Name",
    category: "Category",
    selectCategory: "Select category",
    price: "Price",
    stock: "Stock",
    description: "Description",
    status: "Status",
    fillProductDetails: "Fill in the product details below",

    // Customers
    searchCustomers: "Search customers...",
    customerName: "Customer Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    totalSpent: "Total Spent",
    fillCustomerDetails: "Fill in the customer details below",

    // Orders
    searchOrders: "Search orders...",
    addOrder: "Add Order",
    addNewOrder: "Add New Order",
    fillOrderDetails: "Fill in the order details below",
    customer: "Customer",
    selectCustomer: "Select customer",
    product: "Product",
    selectProduct: "Select product",
    quantity: "Quantity",
  },
  uz: {
    // Navigation
    dashboard: "Boshqaruv paneli",
    products: "Mahsulotlar",
    customers: "Mijozlar",
    orders: "Buyurtmalar",
    logout: "Chiqish",

    // Common
    search: "Qidirish",
    add: "Qo'shish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    cancel: "Bekor qilish",
    save: "Saqlash",
    export: "Eksport",
    viewAll: "Barchasini ko'rish",

    // Dashboard
    totalCustomers: "Jami mijozlar",
    totalProducts: "Jami mahsulotlar",
    totalOrders: "Jami buyurtmalar",
    revenue: "Daromad",
    fromLastMonth: "o'tgan oydan",
    recentOrders: "So'nggi buyurtmalar",
    latestOrderActivity: "So'nggi buyurtma faolligi",
    addProduct: "Mahsulot qo'shish",
    addNewProduct: "Yangi mahsulot qo'shish",
    addCustomer: "Mijoz qo'shish",
    addNewCustomer: "Yangi mijoz qo'shish",
    exportData: "Ma'lumotlarni eksport qilish",
    downloadReports: "Hisobotlarni yuklab olish",

    // Products
    searchProducts: "Mahsulotlarni qidirish...",
    productName: "Mahsulot nomi",
    category: "Kategoriya",
    selectCategory: "Kategoriyani tanlang",
    price: "Narx",
    stock: "Zaxira",
    description: "Tavsif",
    status: "Holat",
    fillProductDetails: "Mahsulot ma'lumotlarini to'ldiring",

    // Customers
    searchCustomers: "Mijozlarni qidirish...",
    customerName: "Mijoz ismi",
    email: "Elektron pochta",
    phone: "Telefon",
    address: "Manzil",
    totalSpent: "Jami sarflangan",
    fillCustomerDetails: "Mijoz ma'lumotlarini to'ldiring",

    // Orders
    searchOrders: "Buyurtmalarni qidirish...",
    addOrder: "Buyurtma qo'shish",
    addNewOrder: "Yangi buyurtma qo'shish",
    fillOrderDetails: "Buyurtma ma'lumotlarini to'ldiring",
    customer: "Mijoz",
    selectCustomer: "Mijozni tanlang",
    product: "Mahsulot",
    selectProduct: "Mahsulotni tanlang",
    quantity: "Miqdor",
  },
  ru: {
    // Navigation
    dashboard: "Панель управления",
    products: "Товары",
    customers: "Клиенты",
    orders: "Заказы",
    logout: "Выйти",

    // Common
    search: "Поиск",
    add: "Добавить",
    edit: "Редактировать",
    delete: "Удалить",
    cancel: "Отмена",
    save: "Сохранить",
    export: "Экспорт",
    viewAll: "Показать все",

    // Dashboard
    totalCustomers: "Всего клиентов",
    totalProducts: "Всего товаров",
    totalOrders: "Всего заказов",
    revenue: "Доход",
    fromLastMonth: "с прошлого месяца",
    recentOrders: "Последние заказы",
    latestOrderActivity: "Последняя активность заказов",
    addProduct: "Добавить товар",
    addNewProduct: "Добавить новый товар",
    addCustomer: "Добавить клиента",
    addNewCustomer: "Добавить нового клиента",
    exportData: "Экспорт данных",
    downloadReports: "Скачать отчеты",

    // Products
    searchProducts: "Поиск товаров...",
    productName: "Название товара",
    category: "Категория",
    selectCategory: "Выберите категорию",
    price: "Цена",
    stock: "Склад",
    description: "Описание",
    status: "Статус",
    fillProductDetails: "Заполните данные товара",

    // Customers
    searchCustomers: "Поиск клиентов...",
    customerName: "Имя клиента",
    email: "Электронная почта",
    phone: "Телефон",
    address: "Адрес",
    totalSpent: "Всего потрачено",
    fillCustomerDetails: "Заполните данные клиента",

    // Orders
    searchOrders: "Поиск заказов...",
    addOrder: "Добавить заказ",
    addNewOrder: "Добавить новый заказ",
    fillOrderDetails: "Заполните данные заказа",
    customer: "Клиент",
    selectCustomer: "Выберите клиента",
    product: "Товар",
    selectProduct: "Выберите товар",
    quantity: "Количество",
  },
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const value = useMemo(
    () => ({ language, setLanguage: changeLanguage, t: translations[language] }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
