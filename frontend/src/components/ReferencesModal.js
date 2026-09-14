import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { acknowledgements, references } from '../content';
import { frostedDialogSx } from '../styles/panels';

const ExternalLink = ({ href, children }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ wordBreak: 'break-word' }}>
    {children}
  </Link>
);

const SectionTitle = ({ children }) => (
  <Typography
    variant="caption"
    color="text.secondary"
    component="h3"
    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, m: 0 }}
  >
    {children}
  </Typography>
);

/** One citation: authors, title, journal (date), pages, DOI and further links. */
const Citation = ({ authors, title, journal, date, pages, doi, links = [] }) => (
  <Typography variant="body2" sx={{ mb: 1 }}>
    {authors} <em>{title}</em>, in <em>{journal}</em> ({date})
    {pages && `, ${pages}`}, doi:{' '}
    <ExternalLink href={`https://doi.org/${doi}`}>{doi}</ExternalLink>
    {links.map(({ label, href }) => (
      <React.Fragment key={href}>
        , <ExternalLink href={href}>{label}</ExternalLink>
      </React.Fragment>
    ))}
  </Typography>
);

const Entries = ({ entries }) =>
  entries.map((entry) => <Citation key={`${entry.doi}-${entry.title}`} {...entry} />);

const ReferencesModal = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={frostedDialogSx}>
    <DialogTitle>References &amp; Data Courtesy</DialogTitle>

    <DialogContent dividers>
      {references.map((section, i) => (
        <Box key={section.title} component="section">
          {i > 0 && <Divider sx={{ my: 2 }} />}
          <SectionTitle>{section.title}</SectionTitle>

          {section.entries && <Box sx={{ mt: 0.5 }}><Entries entries={section.entries} /></Box>}

          {section.subsections?.map((sub) => (
            <Box key={sub.title} sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                {sub.title}
              </Typography>
              <Entries entries={sub.entries} />
            </Box>
          ))}
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />
      <Box component="section">
        <SectionTitle>Acknowledgements</SectionTitle>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {acknowledgements}
        </Typography>
      </Box>
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default ReferencesModal;
