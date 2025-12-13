// Configuration file for names and missions
// Participants are now managed through the admin interface
module.exports = {
  participantMissions: {
    // Empty - add participants through the admin panel
  },
  
  // Keep participants list for backward compatibility
  get participants() {
    return Object.keys(this.participantMissions);
  }
}
