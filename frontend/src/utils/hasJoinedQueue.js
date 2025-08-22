// Utility to check if user has joined the queue for an event
export function hasJoinedQueue(eventId, joinedEventIds) {
  return joinedEventIds.includes(eventId);
}
