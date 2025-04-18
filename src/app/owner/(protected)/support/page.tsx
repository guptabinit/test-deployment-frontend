"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Search,
  MessageCircle,
  Filter,
  RefreshCw,
  Eye,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner" // Change from react-toastify to sonner

interface Ticket {
  _id: string
  subject: string
  description: string
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  priority: "High" | "Medium" | "Low"
  createdAt: string
  lastUpdated: string
  lastMessage: string
  messages: number
}

// Add the PageSkeleton component before the main component
const PageSkeleton = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 sm:mt-0" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-10 w-full sm:w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default function SupportPage() {
  // Add a new state for the new ticket dialog and initial loading state
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    description: "",
    priority: "Medium",
  })
  const [initialLoading, setInitialLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<"all" | "active" | "resolved">("all")
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      _id: "t1",
      subject: "Payment Integration Issue",
      description: "Unable to process card payments in Janpath branch",
      status: "Open",
      priority: "High",
      createdAt: "2024-03-15T10:30:00",
      lastUpdated: "2024-03-15T10:30:00",
      lastMessage: "We're looking into the payment gateway logs...",
      messages: 3,
    },
    {
      _id: "t2",
      subject: "Menu Update Problem",
      description: "Cannot update menu items in Aerocity branch",
      status: "In Progress",
      priority: "Medium",
      createdAt: "2024-03-14T15:45:00",
      lastUpdated: "2024-03-15T09:30:00",
      lastMessage: "The technical team is investigating the issue...",
      messages: 5,
    },
    {
      _id: "t3",
      subject: "Staff Login Issues",
      description: "Staff members unable to login at Connaught Place branch",
      status: "Resolved",
      priority: "High",
      createdAt: "2024-03-13T11:20:00",
      lastUpdated: "2024-03-14T16:45:00",
      lastMessage: "Issue resolved - server maintenance completed",
      messages: 8,
    },
    {
      _id: "t4",
      subject: "QR Code Not Working",
      description: "Table QR codes not scanning in South Extension branch",
      status: "Open",
      priority: "Medium",
      createdAt: "2024-03-15T09:15:00",
      lastUpdated: "2024-03-15T09:15:00",
      lastMessage: "Please provide more details about the scanner being used",
      messages: 1,
    },
  ])

  // Filter tickets based on search query, status filter, and view
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search filter
      const matchesSearch =
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || ticket.status.toLowerCase() === statusFilter.toLowerCase()

      // View filter
      const matchesView =
        view === "all" ||
        (view === "active" && (ticket.status === "Open" || ticket.status === "In Progress")) ||
        (view === "resolved" && (ticket.status === "Resolved" || ticket.status === "Closed"))

      return matchesSearch && matchesStatus && matchesView
    })
  }, [tickets, searchQuery, statusFilter, view])

  // Stats for the dashboard
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
      closed: tickets.filter((t) => t.status === "Closed").length,
      highPriority: tickets.filter((t) => t.priority === "High").length,
    }
  }, [tickets])

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
    }
  }

  // Simulate loading
  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Add useEffect to simulate initial loading
  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Add a function to handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTicketForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add a function to handle form submission
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate ticket creation
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowNewTicketDialog(false)
      // Reset form
      setNewTicketForm({
        subject: "",
        description: "",
        priority: "Medium",
      })
      // Show success message (in a real app)
      alert("Ticket created successfully!")
    }, 1000)
  }

  // Add new handlers
  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowDetailModal(true)
  }

  const handleMarkAsResolved = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket._id === ticketId ? { ...ticket, status: "Resolved" } : ticket))
    )
    toast.success("Ticket marked as resolved")
  }

  const handleCloseTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket._id === ticketId ? { ...ticket, status: "Closed" } : ticket))
    )
    toast.success("Ticket closed")
  }

  // Wrap the entire content with a loading check
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {initialLoading ? (
        // Initial loading skeleton
        <PageSkeleton />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Support Center</h1>
              <p className="text-sm text-gray-500 mt-1">Get help and track your support tickets</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => setShowNewTicketDialog(true)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Create New Ticket
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-gray-800">{stats.open + stats.inProgress}</div>
                <p className="text-sm text-gray-500">Active Tickets</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-red-600">{stats.highPriority}</div>
                <p className="text-sm text-gray-500">High Priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
                <p className="text-sm text-gray-500">Resolved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-gray-600">{stats.total}</div>
                <p className="text-sm text-gray-500">Total Tickets</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
              <Input
                placeholder="Search tickets..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Simple dropdown for status filter */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {showStatusFilter && (
                  <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 font-medium">Filter by Status</div>
                      <div className="h-px bg-gray-200 my-1"></div>
                      <button
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setStatusFilter("all")
                          setShowStatusFilter(false)
                        }}
                      >
                        All Statuses
                      </button>
                      <button
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setStatusFilter("open")
                          setShowStatusFilter(false)
                        }}
                      >
                        Open
                      </button>
                      <button
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setStatusFilter("in progress")
                          setShowStatusFilter(false)
                        }}
                      >
                        In Progress
                      </button>
                      <button
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setStatusFilter("resolved")
                          setShowStatusFilter(false)
                        }}
                      >
                        Resolved
                      </button>
                      <button
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setStatusFilter("closed")
                          setShowStatusFilter(false)
                        }}
                      >
                        Closed
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="all" value={view} onValueChange={(v) => setView(v as "all" | "active" | "resolved")}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Tickets</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tickets Table/Cards */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                // Loading state
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              ) : filteredTickets.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Message</TableHead>
                          <TableHead>Messages</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets.map((ticket) => (
                          <TableRow key={ticket._id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <div className="font-medium">{ticket.subject}</div>
                                <div className="text-xs text-muted-foreground">{ticket.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  ticket.priority === "High"
                                    ? "destructive"
                                    : ticket.priority === "Medium"
                                    ? "warning"
                                    : "success"
                                }
                              >
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  ticket.status === "Open"
                                    ? "default"
                                    : ticket.status === "In Progress"
                                    ? "warning"
                                    : ticket.status === "Resolved"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{ticket.lastMessage}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{ticket.messages}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {formatDate(ticket.createdAt)}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {formatDate(ticket.lastUpdated)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(ticket)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewDetails(ticket)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Reply
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleMarkAsResolved(ticket._id)}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Resolved
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleCloseTicket(ticket._id)}
                                      className="text-red-600"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Close Ticket
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {filteredTickets.map((ticket) => (
                      <Card key={ticket._id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{ticket.subject}</CardTitle>
                            <Badge
                              variant={
                                ticket.status === "Open"
                                  ? "default"
                                  : ticket.status === "In Progress"
                                  ? "warning"
                                  : ticket.status === "Resolved"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs mt-1">{ticket.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                          <div className="flex justify-between text-xs">
                            <div className="flex items-center">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              <span>Priority: </span>
                              <Badge
                                variant={
                                  ticket.priority === "High"
                                    ? "destructive"
                                    : ticket.priority === "Medium"
                                    ? "warning"
                                    : "success"
                                }
                                className="ml-1 text-[10px]"
                              >
                                {ticket.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              <span>Messages: {ticket.messages}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 border-t pt-2 mt-2">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Last updated: {formatDate(ticket.lastUpdated)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>Created: {formatDate(ticket.createdAt)}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-2 bg-gray-50 flex justify-between">
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            Reply
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-1">
                    {searchQuery
                      ? `No tickets match your search "${searchQuery}". Try a different search term or clear filters.`
                      : "You don't have any support tickets yet. Create a new ticket to get help."}
                  </p>
                  <Button className="mt-4" onClick={() => setShowNewTicketDialog(true)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Create New Ticket
                  </Button>
                </div>
              )}
            </CardContent>
            {filteredTickets.length > 0 && (
              <CardFooter className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
                <div>
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <span>Page 1 of 1</span>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>

          {/* New Ticket Dialog */}
          {showNewTicketDialog && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewTicketDialog(false)}
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Create New Support Ticket</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowNewTicketDialog(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmitTicket}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={newTicketForm.subject}
                        onChange={handleFormChange}
                        placeholder="Brief description of the issue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={newTicketForm.description}
                        onChange={handleFormChange}
                        placeholder="Detailed explanation of your issue"
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="priority" className="text-sm font-medium">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={newTicketForm.priority}
                        onChange={handleFormChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline" onClick={() => setShowNewTicketDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Submit Ticket"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Ticket Details Dialog */}
          <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Ticket Details</DialogTitle>
              </DialogHeader>

              {selectedTicket && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Subject</p>
                      <p className="text-sm">{selectedTicket.subject}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge
                        variant={
                          selectedTicket.status === "Open"
                            ? "default"
                            : selectedTicket.status === "In Progress"
                            ? "warning"
                            : "success"
                        }
                      >
                        {selectedTicket.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Priority</p>
                      <Badge
                        variant={
                          selectedTicket.priority === "High"
                            ? "destructive"
                            : selectedTicket.priority === "Medium"
                            ? "warning"
                            : "success"
                        }
                      >
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-sm">{selectedTicket.description}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Messages</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Support Agent</span>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-sm">{selectedTicket.lastMessage}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsResolved(selectedTicket._id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleCloseTicket(selectedTicket._id)
                        setShowDetailModal(false)
                      }}
                    >
                      Close Ticket
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
