"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, Phone, PhoneCall, Edit, Menu } from "lucide-react"
import { toast } from "sonner"
import { fetchWithAuth } from "../../_lib/fetch-with-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaSpinner } from "react-icons/fa"
import { useMediaQuery } from "./hooks/use-media-query"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define types based on the provided JSON structure
interface Contact {
  _id: string
  name: string
  serviceId: string
  landlineContact: string
  mobileContact: string
}

interface Dialer {
  _id: string
  hotelId: string
  contacts: Contact[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface DialerResponse {
  status: number
  message: string
  dialer: Dialer
}

export default function ContactsPage() {
  const [dialer, setDialer] = useState<Dialer | null>(null)
  const [services, setServices] = useState<{ _id: string; serviceName: string }[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    serviceId: "",
    landlineContact: "",
    mobileContact: "",
  })
  const [editContact, setEditContact] = useState<Contact | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Check if the screen is mobile size
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const fetchDialer = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-dialer`)

        if (!res.ok) throw new Error("Failed to fetch dialer data")

        const data: DialerResponse = await res.json()
        data.dialer.contacts.reverse()
        setDialer(data.dialer)
      } catch (error) {
        console.error("Error fetching dialer:", error)
        toast.error("Failed to load dialer contacts")
      }
    }

    const fetchServices = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-services`)
        if (!res.ok) throw new Error("Failed to fetch services")
        const data = await res.json()
        if (Array.isArray(data.services)) {
          setServices(data.services)
        }
      } catch (error) {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services")
      }
    }

    fetchServices()
    fetchDialer()
  }, [])

  // Filter contacts based on search query
  const filteredContacts = dialer?.contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const indexOfLastContact = currentPage * itemsPerPage
  const indexOfFirstContact = indexOfLastContact - itemsPerPage
  const currentContacts = filteredContacts ? filteredContacts.slice(indexOfFirstContact, indexOfLastContact) : []
  const totalPages = filteredContacts ? Math.ceil(filteredContacts.length / itemsPerPage) : 0

  // Get service name by ID
  const getServiceName = (serviceId: string) => {
    const service = services.find((s) => s._id === serviceId)
    return service ? service.serviceName : "Unknown Service"
  }

  // Handle form input changes for new contact
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewContact((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form input changes for edit contact
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editContact) {
      setEditContact({ ...editContact, [name]: value })
    }
  }

  // Handle service selection for new contact
  const handleServiceChange = (value: string) => {
    setNewContact((prev) => ({ ...prev, serviceId: value }))
  }

  // Handle service selection for edit contact
  const handleEditServiceChange = (value: string) => {
    if (editContact) {
      setEditContact({ ...editContact, serviceId: value })
    }
  }

  // Open edit dialog with contact data
  const handleEditClick = (contact: Contact) => {
    setEditContact({ ...contact })
    setIsEditDialogOpen(true)
  }

  // Handle form submission for new contact
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!dialer) throw new Error("Dialer data is not loaded")

      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/add-dialer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            name: newContact.name,
            serviceId: newContact.serviceId,
            landlineContact: newContact.landlineContact,
            mobileContact: newContact.mobileContact,
          },
        ]),
      })

      if (!response.ok) throw new Error("Failed to add contact")

      const responseData = await response.json()
      console.log(responseData)

      // Use the complete contacts list from the response instead of appending
      if (responseData.dialer && Array.isArray(responseData.dialer.contacts)) {
        const updatedDialer: Dialer = {
          ...dialer,
          contacts: responseData.dialer.contacts,
        }
        updatedDialer.contacts.reverse()
        setDialer(updatedDialer)
      } else {
        // Fallback in case the API doesn't return the full list
        // Just add the new contact to avoid duplication
        const newContactWithId = {
          ...newContact,
          _id: Math.random().toString(36).substr(2, 9), // Generate a temporary ID
        } as Contact

        const updatedDialer: Dialer = {
          ...dialer,
          contacts: [...dialer.contacts, newContactWithId],
        }

        setDialer(updatedDialer)
      }

      setNewContact({
        name: "",
        serviceId: "",
        landlineContact: "",
        mobileContact: "",
      })
      setIsDialogOpen(false)
      toast.success("Contact added successfully")
    } catch (error) {
      console.error("Error adding contact:", error)
      toast.error("Failed to add contact")
    }
  }

  // Handle form submission for edit contact
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!dialer || !editContact) throw new Error("Dialer data or edit contact is not loaded")

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-dialer/${editContact._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editContact.name,
            serviceId: editContact.serviceId,
            landlineContact: editContact.landlineContact,
            mobileContact: editContact.mobileContact,
          }),
        },
      )

      if (!response.ok) throw new Error("Failed to update contact")

      const responseData = await response.json()

      // Update the contacts list with the edited contact
      if (responseData.dialer && Array.isArray(responseData.dialer.contacts)) {
        const updatedDialer: Dialer = {
          ...dialer,
          contacts: responseData.dialer.contacts,
        }
        updatedDialer.contacts.reverse()
        setDialer(updatedDialer)
      } else {
        // Fallback in case the API doesn't return the full list
        const updatedContacts = dialer.contacts.map((contact) =>
          contact._id === editContact._id ? editContact : contact,
        )

        const updatedDialer: Dialer = {
          ...dialer,
          contacts: updatedContacts,
        }

        setDialer(updatedDialer)
      }

      setEditContact(null)
      setIsEditDialogOpen(false)
      toast.success("Contact updated successfully")
    } catch (error) {
      console.error("Error updating contact:", error)
      toast.error("Failed to update contact")
    }
  }

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (!dialer) {
    return (
      <div className="p-8 text-center text-gray-500 h-screen w-full flex items-center justify-center">
        <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  }

  // Render a card for mobile view
  const renderContactCard = (contact: Contact) => (
    <Card key={contact._id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{contact.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={18} />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClick(contact)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Call Landline
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PhoneCall className="mr-2 h-4 w-4" />
                Call Mobile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">{getServiceName(contact.serviceId)}</p>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Landline</p>
            <p>{contact.landlineContact}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Mobile</p>
            <p>{contact.mobileContact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Hotel: <span className="text-gray-600">Contacts</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your hotel staff and customer contacts</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Search contacts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-2">
              <Plus size={16} />
              Add New Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>Create a new contact for your hotel services.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="name" className="md:text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newContact.name}
                    onChange={handleInputChange}
                    className="col-span-1 md:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="service" className="md:text-right">
                    Service
                  </Label>
                  <div className="col-span-1 md:col-span-3">
                    <Select value={newContact.serviceId} onValueChange={handleServiceChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="landlineContact" className="md:text-right">
                    Landline
                  </Label>
                  <Input
                    id="landlineContact"
                    name="landlineContact"
                    value={newContact.landlineContact}
                    onChange={handleInputChange}
                    className="col-span-1 md:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="mobileContact" className="md:text-right">
                    Mobile
                  </Label>
                  <Input
                    id="mobileContact"
                    name="mobileContact"
                    value={newContact.mobileContact}
                    onChange={handleInputChange}
                    className="col-span-1 md:col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Add Contact
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-[95%] max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
              <DialogDescription>Update contact information.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="edit-name" className="md:text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editContact?.name || ""}
                    onChange={handleEditInputChange}
                    className="col-span-1 md:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="edit-service" className="md:text-right">
                    Service
                  </Label>
                  <div className="col-span-1 md:col-span-3">
                    <Select value={editContact?.serviceId || ""} onValueChange={handleEditServiceChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="edit-landlineContact" className="md:text-right">
                    Landline
                  </Label>
                  <Input
                    id="edit-landlineContact"
                    name="landlineContact"
                    value={editContact?.landlineContact || ""}
                    onChange={handleEditInputChange}
                    className="col-span-1 md:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label htmlFor="edit-mobileContact" className="md:text-right">
                    Mobile
                  </Label>
                  <Input
                    id="edit-mobileContact"
                    name="mobileContact"
                    value={editContact?.mobileContact || ""}
                    onChange={handleEditInputChange}
                    className="col-span-1 md:col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Update Contact
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredContacts && filteredContacts.length > 0 ? (
        <>
          {/* Mobile view - Card layout */}
          {isMobile ? (
            <div className="space-y-2">{currentContacts.map(renderContactCard)}</div>
          ) : (
            /* Desktop view - Table layout */
            <div className="rounded-md border">
              <ScrollArea className="h-[calc(100vh-340px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Landline</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentContacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{getServiceName(contact.serviceId)}</TableCell>
                        <TableCell>{contact.landlineContact}</TableCell>
                        <TableCell>{contact.mobileContact}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              title="Edit Contact"
                              onClick={() => handleEditClick(contact)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" title="Call Landline">
                              <Phone size={16} />
                            </Button>
                            <Button variant="outline" size="icon" title="Call Mobile">
                              <PhoneCall size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Pagination - Simplified for mobile */}
          {totalPages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 border-t">
              <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                Showing {indexOfFirstContact + 1}-{Math.min(indexOfLastContact, filteredContacts?.length || 0)} of{" "}
                {filteredContacts?.length || 0} contacts
              </div>

              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(currentPage - 1)
                        }}
                      />
                    </PaginationItem>
                  )}

                  {/* Simplified pagination for mobile */}
                  {!isMobile && currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(1)
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {!isMobile && currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(currentPage - 1)
                        }}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(currentPage + 1)
                        }}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {!isMobile && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {!isMobile && currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(totalPages)
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(currentPage + 1)
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-8">
          <CardContent className="pt-6">
            <p className="text-gray-500">No contacts found. Add a new contact to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

