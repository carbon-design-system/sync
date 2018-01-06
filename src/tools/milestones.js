'use strict';

const setDay = require('date-fns/set_day');
const addWeeks = require('date-fns/add_weeks');

// Generic utility for creating bi-weekly GitHub Milestones in a given year.
const generateMilestones = () => {
  const milestones = [
    {
      title: 'Sprint 1: 2018',
      description: '',
      due_on: '2018-01-12T06:00:00.000Z',
    },
  ];
  let date = new Date('2018-01-12T06:00:00.000Z');

  for (let i = 1; i < 26; i++) {
    date = setDay(addWeeks(date, 2), 5);
    milestones.push({
      title: `Sprint ${i + 1}: 2018`,
      description: '',
      due_on: date,
    });
  }
  return milestones;
};

module.exports = generateMilestones;
