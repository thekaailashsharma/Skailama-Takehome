function diffEvent(existing, updates) {
  const changes = [];

  if (updates.timezone && updates.timezone !== existing.timezone) {
    changes.push({
      field: 'timezone',
      oldValue: existing.timezone,
      newValue: updates.timezone
    });
  }

  if (updates.startTime) {
    const oldVal = new Date(existing.startTime).toISOString();
    const newVal = new Date(updates.startTime).toISOString();
    if (oldVal !== newVal) {
      changes.push({
        field: 'startTime',
        oldValue: existing.startTime,
        newValue: updates.startTime
      });
    }
  }

  if (updates.endTime) {
    const oldVal = new Date(existing.endTime).toISOString();
    const newVal = new Date(updates.endTime).toISOString();
    if (oldVal !== newVal) {
      changes.push({
        field: 'endTime',
        oldValue: existing.endTime,
        newValue: updates.endTime
      });
    }
  }

  if (updates.profiles) {
    const oldIds = existing.profiles
      .map(p => (p._id || p).toString())
      .sort()
      .join(',');
    const newIds = updates.profiles
      .map(id => id.toString())
      .sort()
      .join(',');

    if (oldIds !== newIds) {
      changes.push({
        field: 'profiles',
        oldValue: existing.profiles.map(p => p.name || p.toString()),
        newValue: updates.profiles
      });
    }
  }

  return changes;
}

module.exports = diffEvent;
