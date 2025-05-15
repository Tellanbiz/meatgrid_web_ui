import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/time-picker";

const ScheduledDeliveriesPage = () => {
  const [activeTab, setActiveTab] = useState("set");

  const days = [
    { name: "Monday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Tuesday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Wednesday", enabled: true, from: "10:00 AM", to: "5:30 PM" },
    { name: "Thursday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Friday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Saturday", enabled: true, from: "09:00 AM", to: "5:30 PM" },
    { name: "Sunday", enabled: false, from: "09:00 AM", to: "5:30 PM" },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start border-b-0 rounded-none h-12 bg-transparent p-0">
              <TabsTrigger
                value="set"
                className="px-4"
              >
                Set Slots
              </TabsTrigger>
              <TabsTrigger
                value="listed"
                className="px-4"
              >
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
                    <Button>Save</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-4">
                    {days.map((day) => (
                      <div
                        key={day.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Switch checked={day.enabled} />
                          <Label>{day.name}</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <TimePicker
                            value={day.from}
                            onChange={(time) =>
                              console.log("From time changed:", time)
                            }
                          />
                          <span className="text-sm">To</span>
                          <TimePicker
                            value={day.to}
                            onChange={(time) =>
                              console.log("To time changed:", time)
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
