'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FiAlertCircle } from "react-icons/fi";

interface AddHotelFormProps {
  onCloseAction: () => void;
  onSubmitAction: (data: any) => Promise<void>;
}

export const AddHotelForm = ({ onCloseAction, onSubmitAction }: AddHotelFormProps) => {
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelLocation: '',
    description: '',
    ownerUserName: '',
    subscriptionType: 'small',
    subscriptionPeriod: 'monthly',
    branchLimit: '1'
  });

  // Example owners data - in real app, this would come from an API
  const availableOwners = [
    { id: '1', userName: 'owner1', name: 'John Doe' },
    { id: '2', userName: 'owner2', name: 'Jane Smith' },
    { id: '3', userName: 'owner3', name: 'Mike Johnson' },
    { id: '4', userName: 'owner4', name: 'Sarah Williams' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmitAction(formData);
  };

  return (
    <Dialog open onOpenChange={onCloseAction}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Hotel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hotel Details Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hotel Name</Label>
                  <Input
                    required
                    value={formData.hotelName}
                    onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                    placeholder="Enter hotel name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hotel Location</Label>
                  <Input
                    required
                    value={formData.hotelLocation}
                    onChange={(e) => setFormData({ ...formData, hotelLocation: e.target.value })}
                    placeholder="Enter hotel location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter hotel description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Subscription Details Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Select Owner</Label>
                <Select
                  value={formData.ownerUserName}
                  onValueChange={(value) => setFormData({ ...formData, ownerUserName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOwners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.userName}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subscription Type</Label>
                  <Select
                    value={formData.subscriptionType}
                    onValueChange={(value) => setFormData({ ...formData, subscriptionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small Hotels (≤ 3 branches)</SelectItem>
                      <SelectItem value="mid-sized">Mid-sized Hotels (≤ 5 branches)</SelectItem>
                      <SelectItem value="large">Large Hotels (≤ 10 branches)</SelectItem>
                      <SelectItem value="enterprise">Enterprise Hotels (≤ 15 branches)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subscription Period</Label>
                  <Select
                    value={formData.subscriptionPeriod}
                    onValueChange={(value) => setFormData({ ...formData, subscriptionPeriod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Branch Limit</Label>
                <Input
                  type="number"
                  required
                  min="1"
                  max={
                    formData.subscriptionType === 'enterprise' ? 15 :
                    formData.subscriptionType === 'large' ? 10 :
                    formData.subscriptionType === 'mid-sized' ? 5 : 3
                  }
                  value={formData.branchLimit}
                  onChange={(e) => setFormData({ ...formData, branchLimit: e.target.value })}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FiAlertCircle className="h-3 w-3" />
                  Branch limit depends on subscription type
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onCloseAction}>
              Cancel
            </Button>
            <Button type="submit">Add Hotel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
