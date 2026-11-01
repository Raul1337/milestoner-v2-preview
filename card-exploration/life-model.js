// Presentation ordering only; no date/time is assigned and no entity is converted.
export function chronologicalReminders(reminders) {
 const key=value=>typeof value==='string'&&value?value:'\uffff';
 return reminders.map((reminder,index)=>({reminder,index})).sort((a,b)=>
  key(a.reminder.date).localeCompare(key(b.reminder.date)) ||
  key(a.reminder.time).localeCompare(key(b.reminder.time)) || a.index-b.index
 ).map(row=>row.reminder);
}
