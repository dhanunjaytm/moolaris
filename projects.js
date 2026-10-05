const directionExamples = {
  connected: {
    title: 'Connected Devices',
    problem: 'What information would help a user understand a device’s condition before a problem interrupts its use?',
    skills: 'Sensors, microcontrollers, device communication, data display, and basic testing.',
    next: 'Describe who needs the information, what should be measured, and how often it matters.'
  },
  automation: {
    title: 'Smart Automation',
    problem: 'Which repetitive process steps could be represented as a clear, controlled sequence?',
    skills: 'PLC logic, sequence design, sensor inputs, interlocks, and process diagrams.',
    next: 'Sketch the process steps and note what should happen in normal and fault conditions.'
  },
  pcb: {
    title: 'PCB & Prototyping',
    problem: 'How could a circuit requirement be organized into a board concept that can be reviewed?',
    skills: 'Circuit requirements, schematic capture, component selection, board layout, and design review.',
    next: 'List the functions, interfaces, and physical constraints before planning a circuit.'
  }
};

const directionButtons = document.querySelectorAll('.direction-button');
directionButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const example = directionExamples[button.dataset.direction];
    if (!example) return;
    directionButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#direction-count').textContent = `${String(index + 1).padStart(2, '0')} / 03`;
    document.querySelector('#direction-title').textContent = example.title;
    document.querySelector('#direction-problem').textContent = example.problem;
    document.querySelector('#direction-skills').textContent = example.skills;
    document.querySelector('#direction-next').textContent = example.next;
  });
});

document.querySelectorAll('.project-enquiry-form').forEach(form => {
  const status = form.querySelector('.project-form-status');
  form.querySelectorAll('[data-channel]').forEach(button => {
    button.addEventListener('click', () => {
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const isStudent = form.dataset.enquiryType === 'Student';
      const subject = isStudent ? 'Student project or internship enquiry' : 'College program enquiry';
      const body = isStudent
        ? [
            'Hello Moolaris,', '',
            `My name is ${values.get('name')}.`,
            `My email is ${values.get('email')}.`,
            `My college is ${values.get('college')}.`,
            `I am interested in: ${values.get('interest')}.`, '',
            `Message: ${values.get('message')}`
          ]
        : [
            'Hello Moolaris,', '',
            `Institution: ${values.get('institution')}.`,
            `Contact person: ${values.get('contact_person')}.`,
            `Email: ${values.get('email')}.`,
            `Program type: ${values.get('program_type')}.`, '',
            `Description: ${values.get('message')}`
          ];
      const message = body.join('\n');
      if (button.dataset.channel === 'email') {
        window.location.href = `mailto:dhanunjaytmoffical@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        status.textContent = 'Your email app should open with this enquiry addressed to Moolaris. Review it and press Send there.';
      } else {
        const opened = window.open(`https://wa.me/916303363670?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        if (opened) opened.opener = null;
        status.textContent = 'WhatsApp should open with this enquiry addressed to Moolaris. Review it and press Send there.';
      }
    });
  });
});
