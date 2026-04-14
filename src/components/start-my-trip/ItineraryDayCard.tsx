import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X, MapPin, Clock, AlertTriangle, Check } from 'lucide-react';
import { ActivityWithDistance, DayPlan } from '@/utils/smartItineraryPlanner';
import { cn } from '@/lib/utils';

interface ItineraryDayCardProps {
  dayPlan: DayPlan;
  availableActivities: ActivityWithDistance[];
  suggestedActivities: ActivityWithDistance[];
  isSelected: boolean;
  onDaySelect: () => void;
  onActivityAdd: (activityId: string) => void;
  onActivityRemove: (activityId: string) => void;
  onSuggestionAdd: (activityId: string) => void;
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({
  dayPlan,
  availableActivities,
  suggestedActivities,
  isSelected,
  onDaySelect,
  onActivityAdd,
  onActivityRemove,
  onSuggestionAdd
}) => {
  const getDistanceColor = (distance: number) => {
    if (distance <= 20) return 'text-green-600';
    if (distance <= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDistanceBadgeVariant = (distance: number) => {
    if (distance <= 20) return 'secondary';
    if (distance <= 40) return 'outline';
    return 'destructive';
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary border-primary",
        !dayPlan.isValid && "border-red-200 bg-red-50/50"
      )}
      onClick={onDaySelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Day {dayPlan.day}</h3>
            {dayPlan.activities.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {dayPlan.activities.length} activity{dayPlan.activities.length !== 1 ? 'ies' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {dayPlan.totalDistance > 0 && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", getDistanceColor(dayPlan.totalDistance))}
              >
                {dayPlan.totalDistance}km
              </Badge>
            )}
            {!dayPlan.isValid && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Assigned Activities */}
        {dayPlan.activities.length > 0 ? (
          <div className="space-y-2">
            {dayPlan.activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg border"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </p>
                  </div>
                  {activity.distance && (
                    <Badge 
                      variant={getDistanceBadgeVariant(activity.distance)}
                      className="text-xs"
                    >
                      {Math.round(activity.distance)}km
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActivityRemove(activity.id);
                  }}
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No activities planned
            </p>
            <p className="text-xs text-muted-foreground">
              Click to add activities
            </p>
          </div>
        )}

        {/* Warnings */}
        {dayPlan.warnings.length > 0 && (
          <div className="space-y-1">
            {dayPlan.warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Available Activities (only show when day is selected) */}
        {isSelected && availableActivities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Available Activities
            </h4>
            {availableActivities.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2 bg-white border border-dashed border-primary/20 rounded-lg hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.location}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActivityAdd(activity.id);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Suggested Activities (only show when day is selected and has activities) */}
        {isSelected && dayPlan.activities.length > 0 && suggestedActivities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <span>Suggestions nearby</span>
              <Badge variant="outline" className="text-xs">
                Within 60km
              </Badge>
            </h4>
            {suggestedActivities.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2 bg-blue-50/50 border border-dashed border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {activity.location}
                      </p>
                      {activity.distance && (
                        <Badge 
                          variant="secondary"
                          className="text-xs ml-2"
                        >
                          {Math.round(activity.distance)}km away
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSuggestionAdd(activity.id);
                  }}
                  className="h-6 w-6 p-0 border-blue-300 text-blue-600 hover:bg-blue-100"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {dayPlan.activities.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {dayPlan.estimatedDuration}
              </span>
              {dayPlan.totalDistance > 0 && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {dayPlan.totalDistance}km total
                </span>
              )}
            </div>
            {dayPlan.isValid && dayPlan.activities.length > 0 && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};