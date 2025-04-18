"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  XCircle,
  User,
  Tag,
  Building,
  FileText,
  Send,
} from "lucide-react"

interface Ticket {
  _id: string
  hotelName: string
  subject: string
  priority: "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  createdAt: string
  lastUpdated?: string
  category?: string
  assignedTo?: string
  description?: string
  messages?: {
    sender: string
    message: string
    timestamp: string
    isStaff: boolean
  }[]
}

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)

  // Selected ticket for actions
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    hotelName: "",
    subject: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    category: "",
    description: "",
  })

  // Update status form state
  const [updatedStatus, setUpdatedStatus] = useState<"Open" | "In Progress" | "Resolved" | "Closed">("In Progress")
  const [statusNote, setStatusNote] = useState("")

  // Resolve ticket form state
  const [resolutionNote, setResolutionNote] = useState("")

  // Close ticket form state
  const [closureReason, setClosureReason] = useState("")

  // New message in ticket details
  const [newMessage, setNewMessage] = useState("")

  // Mock tickets data
  const tickets: Ticket[] = [
    {
      _id: "t1",
      hotelName: "Taj Palace",
      subject: "Payment Integration Issue",
      priority: "High",
      status: "Open",
      createdAt: "2024-03-15T10:30:00Z",
      lastUpdated: "2024-03-15T14:45:00Z",
      category: "Payment",
      assignedTo: "John Doe",
      description:
        "We're having issues with the payment gateway integration. Customers are unable to complete bookings with credit cards.",
      messages: [
        {
          sender: "Raj Kumar",
          message:
            "Our guests are reporting that credit card payments are failing at the final step. This is urgent as we're losing bookings.",
          timestamp: "2024-03-15T10:30:00Z",
          isStaff: false,
        },
        {
          sender: "John Doe",
          message:
            "I've checked the payment logs and found some API timeout errors. I'll investigate further and get back to you soon.",
          timestamp: "2024-03-15T11:45:00Z",
          isStaff: true,
        },
        {
          sender: "Raj Kumar",
          message: "Thank you. Please let us know as soon as possible when this will be fixed.",
          timestamp: "2024-03-15T12:15:00Z",
          isStaff: false,
        },
      ],
    },
    {
      _id: "t2",
      hotelName: "The Oberoi",
      subject: "Menu Update Problem",
      priority: "Medium",
      status: "In Progress",
      createdAt: "2024-03-14T08:20:00Z",
      lastUpdated: "2024-03-15T09:15:00Z",
      category: "Content",
      assignedTo: "Jane Smith",
      description: "We're unable to update our restaurant menu items in the system. Changes are not being saved.",
      messages: [
        {
          sender: "Vikram Singh",
          message: "We've been trying to update our seasonal menu but the changes aren't saving in the system.",
          timestamp: "2024-03-14T08:20:00Z",
          isStaff: false,
        },
        {
          sender: "Jane Smith",
          message:
            "I've replicated the issue and found a bug in the menu editor. I've assigned this to our development team.",
          timestamp: "2024-03-14T10:30:00Z",
          isStaff: true,
        },
      ],
    },
    {
      _id: "t3",
      hotelName: "Hyatt Regency",
      subject: "Booking System Error",
      priority: "High",
      status: "Open",
      createdAt: "2024-03-15T11:45:00Z",
      category: "Booking",
      description: "The booking system is showing an error when guests try to book more than 3 nights.",
    },
    {
      _id: "t4",
      hotelName: "JW Marriott",
      subject: "Staff Login Issues",
      priority: "Medium",
      status: "In Progress",
      createdAt: "2024-03-13T16:30:00Z",
      lastUpdated: "2024-03-14T10:20:00Z",
      category: "Authentication",
      assignedTo: "Mike Johnson",
      description:
        "Several staff members are unable to log in to the system. They're getting 'Invalid Credentials' errors.",
    },
    {
      _id: "t5",
      hotelName: "The Leela Palace",
      subject: "Room Inventory Sync Problem",
      priority: "High",
      status: "Open",
      createdAt: "2024-03-15T09:15:00Z",
      category: "Inventory",
      description: "Room inventory is not syncing correctly with OTAs, causing overbooking issues.",
    },
    {
      _id: "t6",
      hotelName: "Radisson Blu",
      subject: "Report Generation Failure",
      priority: "Low",
      status: "Resolved",
      createdAt: "2024-03-12T14:20:00Z",
      lastUpdated: "2024-03-14T17:30:00Z",
      category: "Reporting",
      assignedTo: "Sarah Williams",
      description: "Monthly revenue reports are not generating correctly. The data appears to be incomplete.",
    },
    {
      _id: "t7",
      hotelName: "Holiday Inn Express",
      subject: "Mobile App Crash",
      priority: "Medium",
      status: "Closed",
      createdAt: "2024-03-10T08:45:00Z",
      lastUpdated: "2024-03-13T11:20:00Z",
      category: "Mobile App",
      assignedTo: "David Brown",
      description: "The mobile app is crashing when users try to view their booking history.",
    },
  ]

  // Simulate loading
  setTimeout(() => {
    setIsLoading(false)
  }, 1000)

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  // Calculate time since
  const getTimeSince = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays}d ago`
    } else if (diffHours > 0) {
      return `${diffHours}h ago`
    } else if (diffMins > 0) {
      return `${diffMins}m ago`
    } else {
      return "Just now"
    }
  }

  // Priority badge styling
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "warning"
      case "Low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  // Status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "default"
      case "In Progress":
        return "warning"
      case "Resolved":
        return "success"
      case "Closed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />
      case "In Progress":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "Resolved":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />
      case "Closed":
        return <XCircle className="h-3.5 w-3.5 mr-1" />
      default:
        return null
    }
  }

  // Handle opening view details dialog
  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  // Handle opening update status dialog
  const handleUpdateStatus = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setUpdatedStatus(ticket.status === "Open" ? "In Progress" : ticket.status === "In Progress" ? "Resolved" : "Open")
    setStatusNote("")
    setUpdateStatusDialogOpen(true)
  }

  // Handle opening resolve ticket dialog
  const handleResolveTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setResolutionNote("")
    setResolveDialogOpen(true)
  }

  // Handle opening close ticket dialog
  const handleCloseTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setClosureReason("")
    setCloseDialogOpen(true)
  }

  // Handle form submission for creating ticket
  const handleCreateTicket = () => {
    // Here you would typically make an API call to create the ticket
    console.log("Creating ticket:", {
      ...newTicket,
      createdAt: new Date().toISOString(),
      status: "Open",
    })

    // Close the dialog and reset form
    setCreateDialogOpen(false)
    setNewTicket({
      hotelName: "",
      subject: "",
      priority: "Medium",
      category: "",
      description: "",
    })
  }

  // Handle form submission for updating status
  const handleUpdateStatusSubmit = () => {
    if (!selectedTicket) return

    // Here you would typically make an API call to update the ticket status
    console.log("Updating ticket status:", {
      ticketId: selectedTicket._id,
      previousStatus: selectedTicket.status,
      newStatus: updatedStatus,
      note: statusNote,
    })

    // Close the dialog
    setUpdateStatusDialogOpen(false)
  }

  // Handle form submission for resolving ticket
  const handleResolveTicketSubmit = () => {
    if (!selectedTicket) return

    // Here you would typically make an API call to resolve the ticket
    console.log("Resolving ticket:", {
      ticketId: selectedTicket._id,
      resolutionNote,
    })

    // Close the dialog
    setResolveDialogOpen(false)
  }

  // Handle form submission for closing ticket
  const handleCloseTicketSubmit = () => {
    if (!selectedTicket) return

    // Here you would typically make an API call to close the ticket
    console.log("Closing ticket:", {
      ticketId: selectedTicket._id,
      closureReason,
    })

    // Close the dialog
    setCloseDialogOpen(false)
  }

  // Handle sending a new message in ticket details
  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return

    // Here you would typically make an API call to add a message to the ticket
    console.log("Sending message:", {
      ticketId: selectedTicket._id,
      message: newMessage,
    })

    // Clear the message input
    setNewMessage("")
  }

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.category && ticket.category.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tickets, searchQuery, statusFilter, priorityFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter((ticket) => ticket.status === "Open").length
    const inProgress = tickets.filter((ticket) => ticket.status === "In Progress").length
    const resolved = tickets.filter((ticket) => ticket.status === "Resolved").length
    const highPriority = tickets.filter((ticket) => ticket.priority === "High").length

    return { total, open, inProgress, resolved, highPriority }
  }, [tickets])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            System: <span className="text-gray-600 dark:text-gray-400">Support Tickets</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage support tickets from hotels</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="default" size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Tickets</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Open</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{stats.open}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">In Progress</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Resolved</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.resolved}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">High Priority</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-500">{stats.highPriority}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">Filters:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tickets Table */}
      <Card className="overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading state
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-5 w-20" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No tickets found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket._id}>
                      <TableCell className="font-medium">{ticket.hotelName}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(ticket.priority)}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(ticket.status)}
                          className="flex items-center justify-center w-fit"
                        >
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {ticket.category || <span className="text-muted-foreground text-sm">Uncategorized</span>}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {ticket.assignedTo || <span className="text-muted-foreground text-sm">Unassigned</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{formatDate(ticket.createdAt)}</span>
                          <span className="text-xs">{getTimeSince(ticket.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {ticket.status !== "Resolved" && ticket.status !== "Closed" && (
                              <DropdownMenuItem onClick={() => handleResolveTicket(ticket)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Resolved
                              </DropdownMenuItem>
                            )}
                            {ticket.status !== "Closed" && (
                              <DropdownMenuItem onClick={() => handleCloseTicket(ticket)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Close Ticket
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogDescription>
              Create a new support ticket for a hotel. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input
                id="hotelName"
                placeholder="Enter hotel name"
                value={newTicket.hotelName}
                onChange={(e) => setNewTicket({ ...newTicket, hotelName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTicket.category}
                onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking">Booking</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                  <SelectItem value="Reporting">Reporting</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <RadioGroup
                value={newTicket.priority}
                onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue"
                rows={5}
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTicket}
              disabled={!newTicket.hotelName.trim() || !newTicket.subject.trim() || !newTicket.description.trim()}
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>Ticket: {selectedTicket.subject}</span>
                  <Badge variant={getStatusBadgeVariant(selectedTicket.status)} className="ml-2">
                    {selectedTicket.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Ticket #{selectedTicket._id} • Created {formatDate(selectedTicket.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      Hotel
                    </div>
                    <div className="text-sm">{selectedTicket.hotelName}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Category
                    </div>
                    <div className="text-sm">{selectedTicket.category || "Uncategorized"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Priority
                    </div>
                    <div className="text-sm">
                      <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Assigned To
                    </div>
                    <div className="text-sm">{selectedTicket.assignedTo || "Unassigned"}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Description
                  </div>
                  <div className="text-sm p-3 bg-muted rounded-md">
                    {selectedTicket.description || "No description provided."}
                  </div>
                </div>

                <Tabs defaultValue="conversation" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="conversation">Conversation</TabsTrigger>
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                  </TabsList>
                  <TabsContent value="conversation" className="space-y-4 mt-4">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto p-2">
                      {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                        selectedTicket.messages.map((message, index) => (
                          <div key={index} className={`flex ${message.isStaff ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.isStaff ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium">{message.sender}</span>
                                <span className="text-xs opacity-70">{formatDate(message.timestamp)}</span>
                              </div>
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">No messages in this ticket yet.</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="activity" className="space-y-4 mt-4">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                      <div className="flex items-start gap-2">
                        <div className="bg-muted rounded-full p-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Ticket created</p>
                          <p className="text-xs text-muted-foreground">{formatDate(selectedTicket.createdAt)}</p>
                        </div>
                      </div>
                      {selectedTicket.assignedTo && (
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full p-1 mt-0.5">
                            <User className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">Assigned to {selectedTicket.assignedTo}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(selectedTicket.lastUpdated || selectedTicket.createdAt)}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedTicket.status !== "Open" && (
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full p-1 mt-0.5">
                            <RefreshCw className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">Status changed to {selectedTicket.status}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(selectedTicket.lastUpdated || selectedTicket.createdAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setViewDialogOpen(false)
                    handleUpdateStatus(selectedTicket)
                  }}
                >
                  Update Status
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Ticket Status</DialogTitle>
            <DialogDescription>
              Change the status of ticket #{selectedTicket?._id} - {selectedTicket?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant={selectedTicket ? getStatusBadgeVariant(selectedTicket.status) : "default"}>
                  {selectedTicket?.status}
                </Badge>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>New Status</Label>
              <Select value={updatedStatus} onValueChange={(value: any) => setUpdatedStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="statusNote">Status Update Note</Label>
              <Textarea
                id="statusNote"
                placeholder="Add a note about this status change"
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatusSubmit}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Ticket Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Ticket as Resolved</DialogTitle>
            <DialogDescription>
              Resolve ticket #{selectedTicket?._id} - {selectedTicket?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-md dark:bg-blue-900 dark:text-blue-200">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Resolving this ticket</p>
                <p className="text-sm">The ticket will be marked as resolved but can be reopened if needed.</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resolutionNote">Resolution Note</Label>
              <Textarea
                id="resolutionNote"
                placeholder="Describe how the issue was resolved"
                rows={4}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveTicketSubmit} disabled={!resolutionNote.trim()}>
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Ticket Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Close Ticket</DialogTitle>
            <DialogDescription>
              Close ticket #{selectedTicket?._id} - {selectedTicket?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md dark:bg-amber-900 dark:text-amber-200">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Warning: Closing a ticket</p>
                <p className="text-sm">Closed tickets cannot be reopened. Make sure the issue is fully resolved.</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="closureReason">Reason for Closing</Label>
              <Textarea
                id="closureReason"
                placeholder="Provide a reason for closing this ticket"
                rows={4}
                value={closureReason}
                onChange={(e) => setClosureReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCloseTicketSubmit} disabled={!closureReason.trim()}>
              Close Ticket Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
