import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/time-picker";

interface DeliverySlot {
  name: string;
  enabled: boolean;
  from: string;
  to: string;
}

const ScheduledDeliveriesPage = () => {
  const [activeTab, setActiveTab] = useState("set");
  const [slots, setSlots] = useState<DeliverySlot[]>([
    { name: "Monday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Tuesday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Wednesday", enabled: true, from: "10:00 AM", to: "5:30 PM" },
    { name: "Thursday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Friday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Saturday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Sunday", enabled: false, from: "09:00 AM", to: "5:30 PM" },
  ]);

  const handleSwitchChange = (dayName: string, enabled: boolean) => {
    setSlots((currentSlots) =>
      currentSlots.map((slot) =>
        slot.name === dayName ? { ...slot, enabled } : slot
      )
    );
  };

  const handleTimeChange = (
    dayName: string,
    type: "from" | "to",
    time: string
  ) => {
    setSlots((currentSlots) =>
      currentSlots.map((slot) =>
        slot.name === dayName ? { ...slot, [type]: time } : slot
      )
    );
  };

  const handleSave = () => {
    // Prepare data for dispatch
    const deliverySlots = slots.map((slot) => ({
      day: slot.name,
      active: slot.enabled,
      timeRange: `${slot.from}-${slot.to}`,
    }));
    console.log("Ready to dispatch:", deliverySlots);
    // You can dispatch your action here
    // dispatch(saveDeliverySlots(deliverySlots));
  };

  return (
    <div className="w-full p-6">
      <div className="bg-white rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start border-b-0 rounded-none h-12 bg-transparent p-0">
              <TabsTrigger value="set" className="px-4">
                Set Slots
              </TabsTrigger>
              <TabsTrigger value="listed" className="px-4">
                Listed Slots
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="set" className="m-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium mb-1">
                      Set Delivery Slots
                    </h3>
                    <p className="text-sm text-gray-500">
                      Setting delivery slots will enable client to see what time
                      range the order will be delivered
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-4">
                    {slots.map((slot) => (
                      <div
                        key={slot.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={slot.enabled}
                            onCheckedChange={(checked) =>
                              handleSwitchChange(slot.name, checked)
                            }
                          />
                          <Label>{slot.name}</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <TimePicker
                            value={slot.from}
                            onChange={(time) =>
                              handleTimeChange(slot.name, "from", time)
                            }
                          />
                          <span className="text-sm">To</span>
                          <TimePicker
                            value={slot.to}
                            onChange={(time) =>
                              handleTimeChange(slot.name, "to", time)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="listed" className="m-0">
              <div className="min-h-[400px] flex items-center justify-center text-gray-500">
                No listed slots yet
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ScheduledDeliveriesPage;
