"use client"

import { useState } from "react"
import { Search, Filter, CheckCircle, XCircle, AlertTriangle, Truck, FileX, Eye, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Customer {
  id: string
  name: string
  customerNumber: string
  totalBalance: number
  email: string
  emailStatus: "delivered" | "bounced" | "forwarded" | "incomplete"
  lastSent?: string | null
  deliveredAt?: string | null
  bouncedAt?: string | null
  failedAt?: string | null
  bounceReason?: string
  failureReason?: string
  representative: string
  repId: string
  statementType: "email" | "mail"
}

interface EmailInboxProps {
  customers: Customer[]
}

export function EmailInbox({ customers }: EmailInboxProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [repFilter, setRepFilter] = useState<string>("all")

  // Get unique representatives
  const representatives = Array.from(new Set(customers.map((c) => ({ id: c.repId, name: c.representative })))).sort(
    (a, b) => a.name.localeCompare(b.name),
  )

  // Create notifications from customer data
  const notifications = customers
    .filter((customer) => customer.lastSent)
    .map((customer) => ({
      id: customer.id,
      customerName: customer.name,
      customerNumber: customer.customerNumber,
      email: customer.email,
      status: customer.emailStatus,
      timestamp: customer.deliveredAt || customer.bouncedAt || customer.failedAt || customer.lastSent,
      reason: customer.bounceReason || customer.failureReason,
      representative: customer.representative,
      repId: customer.repId,
      statementType: customer.statementType,
      customer,
    }))
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.customerNumber.includes(searchTerm) ||
      notification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.representative.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesRep = repFilter === "all" || notification.repId === repFilter

    return matchesSearch && matchesStatus && matchesRep
  })

  const getStatusIcon = (status: string, statementType: string) => {
    if (statementType === "mail") {
      switch (status) {
        case "forwarded":
        case "delivered":
          return <Truck className="h-4 w-4 text-green-600" />
        case "incomplete":
        case "bounced":
        case "failed":
          return <FileX className="h-4 w-4 text-red-600" />
        default:
          return <FileX className="h-4 w-4 text-gray-600" />
      }
    } else {
      switch (status) {
        case "delivered":
        case "forwarded":
          return <CheckCircle className="h-4 w-4 text-green-600" />
        case "bounced":
        case "incomplete":
        case "failed":
          return <AlertTriangle className="h-4 w-4 text-red-600" />
        default:
          return <XCircle className="h-4 w-4 text-gray-600" />
      }
    }
  }

  const getStatusCounts = () => {
    // Get counts for filtered rep or all notifications
    const relevantNotifications =
      repFilter === "all" ? notifications : notifications.filter((n) => n.repId === repFilter)

    const totalNotifications = notifications

    // Count by actual status values
    const repCounts = {
      total: relevantNotifications.length,
      delivered: relevantNotifications.filter((n) => n.status === "delivered" || n.status === "forwarded").length,
      bounced: relevantNotifications.filter((n) => n.status === "bounced" || n.status === "incomplete").length,
    }

    const totalCounts = {
      total: totalNotifications.length,
      delivered: totalNotifications.filter((n) => n.status === "delivered" || n.status === "forwarded").length,
      bounced: totalNotifications.filter((n) => n.status === "bounced" || n.status === "incomplete").length,
    }

    return { repCounts, totalCounts, showTotals: repFilter !== "all" }
  }

  const { repCounts, totalCounts, showTotals } = getStatusCounts()
  const selectedRep = representatives.find((rep) => rep.id === repFilter)

  return (
    <div className="space-y-6">
      {/* Representative Filter Info */}
      {showTotals && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-100 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">
                Showing results for: <span className="font-bold">{selectedRep?.name}</span>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total</p>
                <p className="text-2xl font-bold text-purple-900">
                  {repCounts.total}
                  {showTotals && <span className="text-lg text-purple-600 ml-1">({totalCounts.total})</span>}
                </p>
              </div>
              <FileX className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-white to-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Delivered/Forwarded</p>
                <p className="text-2xl font-bold text-green-800">
                  {repCounts.delivered}
                  {showTotals && <span className="text-lg text-green-600 ml-1">({totalCounts.delivered})</span>}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Bounced/Incomplete</p>
                <p className="text-2xl font-bold text-red-800">
                  {repCounts.bounced}
                  {showTotals && <span className="text-lg text-red-600 ml-1">({totalCounts.bounced})</span>}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Notifications Table */}
      <Card className="border-purple-200 shadow-lg bg-white">
        <CardHeader className="bg-gradient-to-r from-yellow-100 to-purple-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-purple-800">Statement Status Notifications</CardTitle>
              <CardDescription className="text-purple-700">
                {filteredNotifications.length} of {notifications.length} notifications
                {showTotals && ` • Filtered by ${selectedRep?.name}`}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-purple-500" />
                <Select value={repFilter} onValueChange={setRepFilter}>
                  <SelectTrigger className="w-48 border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="All Representatives" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Representatives</SelectItem>
                    {representatives.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-purple-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="delivered">Delivered/Forwarded</SelectItem>
                    <SelectItem value="bounced">Bounced/Incomplete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-purple-500" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-50 hover:bg-purple-100">
                <TableHead className="text-purple-800 font-semibold">Status</TableHead>
                <TableHead className="text-purple-800 font-semibold">Customer</TableHead>
                <TableHead className="text-purple-800 font-semibold">Representative</TableHead>
                <TableHead className="text-purple-800 font-semibold">Statement Type</TableHead>
                <TableHead className="text-purple-800 font-semibold">Timestamp</TableHead>
                <TableHead className="text-purple-800 font-semibold">Details</TableHead>
                <TableHead className="w-24 text-purple-800 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification, index) => (
                <TableRow
                  key={`${notification.id}-${notification.timestamp}`}
                  className={`hover:bg-yellow-50 ${index % 2 === 0 ? "bg-white" : "bg-purple-25"}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status, notification.statementType)}
                      <Badge
                        className={
                          notification.status === "delivered" || notification.status === "forwarded"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }
                      >
                        {notification.statementType === "email"
                          ? notification.status === "delivered" || notification.status === "forwarded"
                            ? "Delivered"
                            : "Bounced"
                          : notification.status === "delivered" || notification.status === "forwarded"
                            ? "Forwarded"
                            : "Incomplete"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-purple-900">{notification.customerName}</div>
                      <div className="text-sm text-purple-600 font-mono">{notification.customerNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-purple-700 font-medium">{notification.representative}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      {notification.statementType === "email" ? "Email" : "Physical Mail"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-purple-700">
                    {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {notification.reason && <span className="text-red-600">{notification.reason}</span>}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-300 text-purple-700 hover:bg-purple-100 hover:text-purple-800 bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-purple-200">
                        <DialogHeader>
                          <DialogTitle className="text-purple-800">Statement Status Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-purple-800">Customer Information</h4>
                            <p className="text-sm text-purple-700">{notification.customerName}</p>
                            <p className="text-sm text-purple-600 font-mono">{notification.customerNumber}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-800">Representative</h4>
                            <p className="text-sm text-purple-700">{notification.representative}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-800">Statement Status</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(notification.status, notification.statementType)}
                              <span className="capitalize text-purple-700">
                                {notification.statementType === "email"
                                  ? notification.status === "delivered" || notification.status === "forwarded"
                                    ? "Delivered"
                                    : "Bounced"
                                  : notification.status === "delivered" || notification.status === "forwarded"
                                    ? "Forwarded"
                                    : "Incomplete"}
                              </span>
                            </div>
                          </div>
                          {notification.customer.lastSent && (
                            <div>
                              <h4 className="font-medium text-purple-800">
                                {notification.statementType === "email" ? "Sent" : "Mailed"}
                              </h4>
                              <p className="text-sm text-purple-700">
                                {new Date(notification.customer.lastSent).toLocaleString()}
                              </p>
                            </div>
                          )}
                          {notification.customer.deliveredAt && (
                            <div>
                              <h4 className="font-medium text-purple-800">
                                {notification.statementType === "email" ? "Delivered" : "Forwarded"}
                              </h4>
                              <p className="text-sm text-purple-700">
                                {new Date(notification.customer.deliveredAt).toLocaleString()}
                              </p>
                            </div>
                          )}
                          {(notification.customer.bouncedAt || notification.customer.failedAt) && (
                            <div>
                              <h4 className="font-medium text-purple-800">
                                {notification.statementType === "email" ? "Bounced" : "Incomplete"}
                              </h4>
                              <p className="text-sm text-purple-700">
                                {new Date(
                                  notification.customer.bouncedAt || notification.customer.failedAt || "",
                                ).toLocaleString()}
                              </p>
                              {notification.reason && (
                                <p className="text-sm text-red-600 mt-1">Reason: {notification.reason}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
