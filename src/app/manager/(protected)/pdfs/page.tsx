"use client"

import type React from "react"

import { useState , useEffect } from "react"
import { FiSearch, FiDownload, FiEye, FiTrash2, FiUpload, FiEdit } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { fetchWithAuth } from "../../_lib/fetch-with-auth"
import { FaSpinner } from "react-icons/fa"

interface PDF {
  _id: string
  hotelId: string
  pdfName: string
  pdfType: string
  pdfLink: string
  pdfDescription: string
  size: string
  createdAt: string
}

const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid date"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  } catch (error) {
    return "Invalid date"
  }
}

const UploadModal = ({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (newPdf: PDF) => void
}) => {
  const [submitUploadLoading, setSubmitUploadLoading] = useState(false)

  const [form, setForm] = useState({
    pdfName: "",
    pdfType: "",
    pdfDescription: "",
    pdfLink: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpload = async () => {
    try {
      setSubmitUploadLoading(true)

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/create-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      )

      if (!response.ok) throw new Error("Failed to upload PDF")

      const data = await response.json()
      onSave(data.pdf) 
      onOpenChange(false)
      toast.success("PDF uploaded successfully!")

      setForm({
        pdfName: "",
        pdfType: "",
        pdfDescription: "",
        pdfLink: "",
      })
    } catch (error) {
      console.error("Error uploading PDF:", error)
      toast.error("Failed to upload PDF")
    } finally {
      setSubmitUploadLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>PDF Name</Label>
            <Input
              name="pdfName"
              value={form.pdfName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>PDF Type</Label>
            <Input
              name="pdfType"
              value={form.pdfType}
              onChange={handleChange}
              placeholder="e.g. Menu, Wine List"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              name="pdfDescription"
              value={form.pdfDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>PDF Link</Label>
            <Input
              name="pdfLink"
              value={form.pdfLink}
              onChange={handleChange}
              placeholder="https://drive.google.com/file/d/your-id/view"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              disabled={submitUploadLoading}
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={submitUploadLoading} onClick={handleUpload}>
              {submitUploadLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}




const EditModal = ({ open, onOpenChange, pdf, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; pdf: PDF | null; onSave: (updated: PDF) => void }) => {
  const [editedPDF, setEditedPDF] = useState<PDF | null>(pdf)
  const [submitEditLoading, setSubmitEditLoading] = useState(false)

  useEffect(() => {
    setEditedPDF(pdf)
  }, [pdf])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editedPDF) {
      setEditedPDF({ ...editedPDF, [name]: value })
    }
  }

  const handleSave = async () => {
    if (!editedPDF) return
  
    try {
      setSubmitEditLoading(true)
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-pdf/${editedPDF._id}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedPDF),
        }
      )
  
      if (!response.ok) throw new Error("Failed to update PDF")
  
      onSave(editedPDF)
      onOpenChange(false)
      toast.success("PDF updated successfully!")
    } catch (error) {
      console.error("Error updating PDF:", error)
      toast.error("Failed to update PDF")
    } finally {
      setSubmitEditLoading(false)
    }
  }
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit PDF</DialogTitle>
        </DialogHeader>
        {editedPDF && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>PDF Name</Label>
              <Input name="pdfName" value={editedPDF.pdfName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>PDF Type</Label>
              <Input name="pdfType" value={editedPDF.pdfType} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input name="pdfDescription" value={editedPDF.pdfDescription} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>PDF Link</Label>
              <Input name="pdfLink" value={editedPDF.pdfLink} onChange={handleChange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button disabled={submitEditLoading} variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button disabled={submitEditLoading} onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

const DeleteModal = ({
  open,
  onOpenChange,
  pdf,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdf: PDF | null
  onDelete: (deletedId: string) => void
}) => {
  const [submitDeleteLoading, setSubmitDeleteLoading] = useState(false)

  const handleDelete = async () => {
    if (!pdf) return

    try {
      setSubmitDeleteLoading(true)

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/delete-pdf/${pdf._id}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) throw new Error("Failed to delete PDF")

      onDelete(pdf._id)
      onOpenChange(false)
      toast.success("PDF deleted successfully!")
    } catch (error) {
      console.error("Error deleting PDF:", error)
      toast.error("Failed to delete PDF")
    } finally {
      setSubmitDeleteLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete PDF</DialogTitle>
        </DialogHeader>
        {pdf && (
          <div className="space-y-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">{pdf.pdfName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                disabled={submitDeleteLoading}
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={submitDeleteLoading}
                variant="destructive"
                onClick={handleDelete}
              >
                {submitDeleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


export default function PDFsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [pdfToDelete, setPdfToDelete] = useState<PDF | null>(null)

  const [pdfs, setPDFs] = useState<PDF[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPDFs = async () => {
      setLoading(true)
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-pdfs`
        )

        if (!res.ok) throw new Error("Failed to fetch PDFs")

        const data = await res.json()

        setPDFs(data.pdfs)
      } catch (error) {
        console.error("Error fetching PDFs:", error)
        toast.error("Failed to load PDFs")
      } finally {
        setLoading(false)
      }
    }

    fetchPDFs()
  }, [])

  const filteredPDFs = pdfs.filter(
    (pdf) =>
      pdf.pdfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.pdfType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleView = (pdfLink: string) => {
    if (pdfLink) {
      window.open(pdfLink, "_blank")
    } else {
      toast.error("PDF link not available")
    }
  }
  

  const handleDelete = (pdf: PDF) => {
    setPdfToDelete(pdf)
    setDeleteModalOpen(true)
  }
  

  const handleEdit = (pdf: PDF) => {
    setSelectedPDF(pdf)
    setEditModalOpen(true)
  }

  const handleSaveEdit = (updatedPDF: PDF) => {
    const updatedList = pdfs.map((pdf) =>
      pdf._id === updatedPDF._id ? updatedPDF : pdf
    )
    setPDFs(updatedList)
  }
  
  

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 h-screen w-full flex items-center justify-center">
        <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container space-y-6 p-8">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">PDF Documents</h1>
          <p className="text-sm text-muted-foreground">Manage your restaurant's PDF documents</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <FiSearch className="absolute left-2.5 top-2.5 text-muted-foreground" size={16} />
        </div>

        <Button onClick={() => setShowUploadModal(true)}>
          <FiUpload className="mr-2" size={16} />
          Upload PDF
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPDFs.map((pdf,i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{pdf.pdfName}</TableCell>
                <TableCell>{pdf.pdfType}</TableCell>
                <TableCell>{pdf.pdfDescription}</TableCell>
                <TableCell>{formatDate(pdf.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(pdf.pdfLink)} title="View">
                      <FiEye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(pdf)} title="Edit">
                      <FiEdit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pdf)}
                      className="text-destructive"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredPDFs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No PDFs found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UploadModal
  open={showUploadModal}
  onOpenChange={setShowUploadModal}
  onSave={(newPdf) => setPDFs((prev) => [...prev, newPdf])}
/>
      <EditModal open={editModalOpen} onOpenChange={setEditModalOpen} pdf={selectedPDF} onSave={handleSaveEdit} />
      <DeleteModal
  open={deleteModalOpen}
  onOpenChange={setDeleteModalOpen}
  pdf={pdfToDelete}
  onDelete={(deletedId) =>
    setPDFs((prev) => prev.filter((p) => p._id !== deletedId))
  }
/>

    </div>
  )
}
