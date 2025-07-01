"use client"

import { useState } from "react"
import { Search, Mail, Eye, FileText, Send, Inbox, ArrowLeft, Globe, MailIcon, User, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EmailStatusBadge } from "@/components/email-status-badge"
import { EmailInbox } from "@/components/email-inbox"
import { CustomerStatementHistory } from "@/components/customer-statement-history"
import { AllStatementsView } from "@/components/all-statements-view"

// Mock data for portal-enabled customers with updated status logic and dispute information
const customers = [
  {
    id: "1",
    name: "ROUTE 2 MINI MART - GUYANDOTTE",
    customerNumber: "0901008013",
    totalBalance: 525.42,
    email: "manager@route2mini.com",
    physicalAddress: "123 Main St, Guyandotte, WV 25526",
    selected: false,
    statementType: "email" as const,
    emailStatus: "sent", // processing, sent, forwarded, manual mailing required
    lastSent: "2024-01-15T10:30:00Z",
    deliveredAt: "2024-01-15T10:32:15Z",
    representative: "Sarah Johnson",
    repId: "rep1",
    customerType: "Independent" as const,
  },
  {
    id: "2",
    name: "BLISSFIELD PARTY MART",
    customerNumber: "0901000074",
    totalBalance: 159.0,
    email: "orders@blissfieldparty.com",
    physicalAddress: "456 Oak Ave, Blissfield, MI 49228",
    selected: false,
    statementType: "mail" as const,
    emailStatus: "manual mailing required", // Bill-To customers require manual mailing
    lastSent: "2024-01-15T10:30:00Z",
    representative: "Mike Chen",
    repId: "rep2",
    customerType: "Bill-To" as const,
  },
  {
    id: "3",
    name: "ERIE FOODS",
    customerNumber: "0902000013",
    totalBalance: 248.35,
    email: "accounting@eriefoods.com",
    physicalAddress: "789 Pine St, Erie, PA 16501",
    selected: false,
    statementType: "email" as const,
    emailStatus: "processing",
    lastSent: "2024-01-15T10:30:00Z",
    representative: "Sarah Johnson",
    repId: "rep1",
    customerType: "Bill-To" as const,
  },
  {
    id: "4",
    name: "SAUTTER'S FOODS - WATERVILLE",
    customerNumber: "0902000023",
    totalBalance: 1008.32,
    email: "manager@sauttersfoods.com",
    physicalAddress: "321 Elm St, Waterville, OH 43566",
    selected: false,
    statementType: "mail" as const,
    emailStatus: "forwarded", // Independent customers get automatic forwarding
    lastSent: "2024-01-15T10:30:00Z",
    representative: "Lisa Rodriguez",
    repId: "rep3",
    customerType: "Independent" as const,
  },
  {
    id: "5",
    name: "IN & OUT #54 BERDAN",
    customerNumber: "0957330054",
    totalBalance: 134.69,
    email: "store54@inandout.com",
    physicalAddress: "654 Cedar Rd, Berdan, NJ 07621",
    selected: false,
    statementType: "email" as const,
    emailStatus: "sent",
    lastSent: "2024-01-14T09:15:00Z",
    deliveredAt: "2024-01-14T09:17:22Z",
    representative: "Mike Chen",
    repId: "rep2",
    customerType: "Chain" as const,
  },
  {
    id: "6",
    name: "MARSHALLS",
    customerNumber: "0301002116",
    totalBalance: 1023.22,
    email: "finance@marshalls.com",
    physicalAddress: "987 Maple Dr, Boston, MA 02101",
    selected: false,
    statementType: "mail" as const,
    emailStatus: "manual mailing required", // Chain customers require manual mailing
    lastSent: "2024-01-15T10:30:00Z",
    representative: "Sarah Johnson",
    repId: "rep1",
    customerType: "Chain" as const,
  },
  {
    id: "7",
    name: "RIVERSIDE CARRY OUT",
    customerNumber: "0301002154",
    totalBalance: 627.34,
    email: "owner@riversidecarryout.com",
    physicalAddress: "147 River St, Riverside, CA 92501",
    selected: false,
    statementType: "mail" as const,
    emailStatus: "forwarded", // Independent customers get automatic forwarding
    lastSent: "2024-01-15T10:30:00Z",
    representative: "Lisa Rodriguez",
    repId: "rep3",
    customerType: "Independent" as const,
  },
  {
    id: "8",
    name: "WARRIOR SOCCER CLUB",
    customerNumber: "0311000014",
    totalBalance: 215.0,
    email: "treasurer@warriorsoccer.com",
    physicalAddress: "258 Sports Way, Warrior, AL 35180",
    selected: false,
    statementType: "email" as const,
    emailStatus: "sent",
    lastSent: "2024-01-15T10:30:00Z",
    representative: "Mike Chen",
    repId: "rep2",
    customerType: "Bill-To" as const,
  },
]

export default function StatementEmailsDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [emailsSentToday, setEmailsSentToday] = useState(0)
  const [sendMode, setSendMode] = useState("selected")
  const [testEmail, setTestEmail] = useState("")
  const [currentView, setCurrentView] = useState<"dashboard" | "inbox">("dashboard")
  const [statementTypeFilter, setStatementTypeFilter] = useState<"all" | "email" | "mail">("all")
  const [repFilter, setRepFilter] = useState<string>("all")
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("all")
  const [favoriteReps, setFavoriteReps] = useState<string[]>(["rep1", "rep3"]) // Mock favorites
  const [repSearchTerm, setRepSearchTerm] = useState("")
  const [recentReps] = useState<string[]>(["rep2", "rep1", "rep3"]) // Mock recent reps

  // Get unique representatives
  const representatives = Array.from(new Set(customers.map((c) => ({ id: c.repId, name: c.representative })))).sort(
    (a, b) => a.name.localeCompare(b.name),
  )

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.customerNumber.includes(searchTerm)
    const matchesType = statementTypeFilter === "all" || customer.statementType === statementTypeFilter
    const matchesRep = repFilter === "all" || customer.repId === repFilter
    const matchesCustomerType = customerTypeFilter === "all" || customer.customerType === customerTypeFilter
    return matchesSearch && matchesType && matchesRep && matchesCustomerType
  })

  const totalCustomers = customers.length
  const selectedCount = selectedCustomers.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId])
    } else {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId))
    }
  }

  const handleSendStatements = () => {
    const customersToSend =
      sendMode === "all" ? filteredCustomers : filteredCustomers.filter((c) => selectedCustomers.includes(c.id))

    setEmailsSentToday(emailsSentToday + customersToSend.length)
    setSelectedCustomers([])
  }

  const handleStatementTypeToggle = (type: "email" | "mail") => {
    if (statementTypeFilter === type) {
      setStatementTypeFilter("all") // Unselect if already selected
    } else {
      setStatementTypeFilter(type)
    }
  }

  const getActiveFiltersDescription = () => {
    const filters = []
    if (statementTypeFilter !== "all") {
      filters.push(`${statementTypeFilter === "email" ? "Email" : "Physical Mail"}`)
    }
    if (repFilter !== "all") {
      const rep = representatives.find((r) => r.id === repFilter)
      filters.push(`Rep: ${rep?.name}`)
    }
    if (customerTypeFilter !== "all") {
      filters.push(`Type: ${customerTypeFilter}`)
    }
    return filters.length > 0 ? ` • Filtered by ${filters.join(", ")}` : ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 border-b border-purple-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-yellow-300" />
              <div>
                <h1 className="text-2xl font-bold text-white">Send Statements</h1>
                <p className="text-sm text-purple-100">Generate and send monthly AR statements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* AR Rep Search with Favorites */}
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-purple-100" />
                <div className="relative">
                  <Input
                    placeholder="Search representatives..."
                    value={repSearchTerm}
                    onChange={(e) => setRepSearchTerm(e.target.value)}
                    className="w-48 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20"
                  />
                  {(repSearchTerm || repFilter !== "all") && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-purple-200 z-50 max-h-60 overflow-y-auto">
                      {/* Favorites Section */}
                      {favoriteReps.length > 0 && (
                        <>
                          <div className="px-3 py-2 text-xs font-semibold text-purple-600 bg-purple-50 border-b">
                            Favorites
                          </div>
                          {representatives
                            .filter((rep) => favoriteReps.includes(rep.id))
                            .filter((rep) => rep.name.toLowerCase().includes(repSearchTerm.toLowerCase()))
                            .map((rep) => (
                              <div
                                key={`fav-${rep.id}`}
                                className="flex items-center justify-between px-3 py-2 hover:bg-purple-50 cursor-pointer"
                                onClick={() => {
                                  setRepFilter(rep.id)
                                  setRepSearchTerm("")
                                }}
                              >
                                <span className="text-sm text-purple-800">{rep.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setFavoriteReps(favoriteReps.filter((id) => id !== rep.id))
                                  }}
                                  className="text-yellow-500 hover:text-yellow-600"
                                >
                                  ★
                                </button>
                              </div>
                            ))}
                        </>
                      )}

                      {/* Recent Section */}
                      <div className="px-3 py-2 text-xs font-semibold text-purple-600 bg-purple-50 border-b">
                        Recent
                      </div>
                      {representatives
                        .filter((rep) => recentReps.includes(rep.id) && !favoriteReps.includes(rep.id))
                        .filter((rep) => rep.name.toLowerCase().includes(repSearchTerm.toLowerCase()))
                        .slice(0, 5)
                        .map((rep) => (
                          <div
                            key={`recent-${rep.id}`}
                            className="flex items-center justify-between px-3 py-2 hover:bg-purple-50 cursor-pointer"
                            onClick={() => {
                              setRepFilter(rep.id)
                              setRepSearchTerm("")
                            }}
                          >
                            <span className="text-sm text-purple-800">{rep.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setFavoriteReps([...favoriteReps, rep.id])
                              }}
                              className="text-gray-400 hover:text-yellow-500"
                            >
                              ☆
                            </button>
                          </div>
                        ))}

                      {/* All Representatives */}
                      <div className="px-3 py-2 text-xs font-semibold text-purple-600 bg-purple-50 border-b">
                        All Representatives
                      </div>
                      <div
                        className="px-3 py-2 hover:bg-purple-50 cursor-pointer"
                        onClick={() => {
                          setRepFilter("all")
                          setRepSearchTerm("")
                        }}
                      >
                        <span className="text-sm text-purple-800">All Representatives</span>
                      </div>
                      {representatives
                        .filter((rep) => rep.name.toLowerCase().includes(repSearchTerm.toLowerCase()))
                        .map((rep) => (
                          <div
                            key={`all-${rep.id}`}
                            className="flex items-center justify-between px-3 py-2 hover:bg-purple-50 cursor-pointer"
                            onClick={() => {
                              setRepFilter(rep.id)
                              setRepSearchTerm("")
                            }}
                          >
                            <span className="text-sm text-purple-800">{rep.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (favoriteReps.includes(rep.id)) {
                                  setFavoriteReps(favoriteReps.filter((id) => id !== rep.id))
                                } else {
                                  setFavoriteReps([...favoriteReps, rep.id])
                                }
                              }}
                              className={
                                favoriteReps.includes(rep.id)
                                  ? "text-yellow-500 hover:text-yellow-600"
                                  : "text-gray-400 hover:text-yellow-500"
                              }
                            >
                              {favoriteReps.includes(rep.id) ? "★" : "☆"}
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentView(currentView === "dashboard" ? "inbox" : "dashboard")}
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                {currentView === "dashboard" ? (
                  <>
                    <Inbox className="h-4 w-4" />
                    Email Inbox
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </>
                )}
              </Button>
              <Badge className="bg-yellow-400 text-purple-900 text-lg px-4 py-2 font-semibold hover:bg-yellow-300">
                Emails Sent Today: {emailsSentToday}/{totalCustomers}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" ? (
          <>
            {/* Controls Section */}
            <Card className="mb-6 border-purple-200 shadow-lg bg-gradient-to-r from-white to-purple-50">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-yellow-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Send Monthly Statements
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Select customers below and send their monthly statements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-center">
                  <Button
                    onClick={handleSendStatements}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg px-8 py-3"
                    disabled={selectedCount === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Resend/Print Monthly Statements ({selectedCount})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Table */}
            <Card className="border-purple-200 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-purple-100 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-purple-800">Customers</CardTitle>
                    <CardDescription className="text-purple-700">
                      {filteredCustomers.length} of {totalCustomers} customers
                      {selectedCount > 0 && ` • ${selectedCount} selected`}
                      {getActiveFiltersDescription()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-purple-500" />
                      <Input
                        placeholder="Search customers or account numbers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-80 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center space-x-2 border-l border-purple-300 pl-4">
                      <span className="text-sm font-medium text-purple-700">Statement:</span>
                      <Toggle
                        pressed={statementTypeFilter === "email"}
                        onPressedChange={() => handleStatementTypeToggle("email")}
                        className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Email
                      </Toggle>
                      <Toggle
                        pressed={statementTypeFilter === "mail"}
                        onPressedChange={() => handleStatementTypeToggle("mail")}
                        className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                      >
                        <MailIcon className="h-4 w-4 mr-1" />
                        Mail
                      </Toggle>
                    </div>
                    <div className="flex items-center space-x-2 border-l border-purple-300 pl-4">
                      <Building2 className="h-4 w-4 text-purple-500" />
                      <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
                        <SelectTrigger className="w-40 border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Customer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Chain">Chain</SelectItem>
                          <SelectItem value="Bill-To">Bill-To</SelectItem>
                          <SelectItem value="Independent">Independent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-50 hover:bg-purple-100">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCount === filteredCustomers.length && filteredCustomers.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                      </TableHead>
                      <TableHead className="text-purple-800 font-semibold">Customer Name</TableHead>
                      <TableHead className="text-purple-800 font-semibold">Customer Number</TableHead>
                      <TableHead className="text-purple-800 font-semibold">Customer Type</TableHead>
                      <TableHead className="text-purple-800 font-semibold">Statement Type</TableHead>
                      <TableHead className="text-purple-800 font-semibold">Status</TableHead>
                      <TableHead className="text-right text-purple-800 font-semibold">Total Balance</TableHead>
                      <TableHead className="w-24 text-purple-800 font-semibold">Show Statements</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer, index) => (
                      <TableRow
                        key={customer.id}
                        className={`hover:bg-yellow-50 ${index % 2 === 0 ? "bg-white" : "bg-purple-25"}`}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                            className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="font-medium text-purple-900 hover:text-purple-700 hover:underline text-left">
                                {customer.name}
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-purple-200">
                              <DialogHeader>
                                <DialogTitle className="text-purple-800">{customer.name} Statement History</DialogTitle>
                              </DialogHeader>
                              <CustomerStatementHistory customer={customer} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-purple-700">{customer.customerNumber}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              customer.customerType === "Chain"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : customer.customerType === "Bill-To"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : "bg-orange-100 text-orange-800 border-orange-300"
                            }
                          >
                            {customer.customerType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 cursor-help">
                                  {customer.statementType === "email" ? (
                                    <Globe className="h-4 w-4 text-purple-600" />
                                  ) : (
                                    <MailIcon className="h-4 w-4 text-purple-600" />
                                  )}
                                  <span className="text-sm text-purple-700 capitalize">
                                    {customer.statementType === "email" ? "Email" : "Physical Mail"}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-purple-900 text-white border-purple-700">
                                <div className="text-sm">
                                  <div className="font-medium mb-1">
                                    {customer.statementType === "email" ? "Email Address:" : "Mailing Address:"}
                                  </div>
                                  <div>
                                    {customer.statementType === "email" ? customer.email : customer.physicalAddress}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <EmailStatusBadge
                            status={customer.emailStatus}
                            lastSent={customer.lastSent}
                            deliveredAt={customer.deliveredAt}
                            bouncedAt={customer.bouncedAt}
                            failedAt={customer.failedAt}
                            bounceReason={customer.bounceReason}
                            failureReason={customer.failureReason}
                            statementType={customer.statementType}
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono text-purple-900 font-semibold">
                          ${customer.totalBalance.toFixed(2)}
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
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto border-purple-200">
                              <DialogHeader>
                                <DialogTitle className="text-purple-800">All Statements - {customer.name}</DialogTitle>
                              </DialogHeader>
                              <AllStatementsView customer={customer} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <EmailInbox customers={customers} />
        )}
      </div>
    </div>
  )
}
