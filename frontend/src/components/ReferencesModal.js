/**
 * Usage:
 *   <ReferencesModal open={open} onClose={handleClose} />
 */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Link,
  Button,
} from '@mui/material';

const ReferencesModal = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>References &amp; Data Courtesy</DialogTitle>

    <DialogContent dividers>
      {/* Data */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
        Data
      </Typography>

      {/* Phytoplankton */}
      <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
        Phytoplankton
      </Typography>
      <Typography variant="body2" paragraph>
        Damiano&nbsp;Righetti&nbsp;et&nbsp;al.&nbsp;
        <em>PhytoBase: A global synthesis of open-ocean phytoplankton
          occurrences</em>,&nbsp;in <em>Earth System Science Data</em> (2020),
        pp.&nbsp;907–933,&nbsp;doi:&nbsp;
        <Link
          href="https://doi.org/10.5194/essd-12-907-2020"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.5194/essd-12-907-2020
        </Link>
        ,&nbsp;url:&nbsp;
        <Link
          href="https://essd.copernicus.org/articles/12/907/2020/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          essd.copernicus.org/articles/12/907/2020/
        </Link>
      </Typography>

      {/* Zooplankton */}
      <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
        Zooplankton
      </Typography>
      <Typography variant="body2" paragraph>
        Benedetti&nbsp;et&nbsp;al.&nbsp;<em>Major restructuring of marine
          plankton assemblages under global warming</em>&nbsp;
        E.&nbsp;T.&nbsp;Buitenhuis&nbsp;et&nbsp;al.&nbsp;
        <em>MAREDAT: towards a world atlas of MARine Ecosystem&nbsp;DATa</em>,
        in <em>Earth System Science Data</em> (July&nbsp;2013), pp.&nbsp;227–239,
        doi:&nbsp;
        <Link
          href="https://doi.org/10.5194/essd-5-227-2013"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.5194/essd-5-227-2013
        </Link>
      </Typography>

      {/* Species Distribution Models */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
        Species Distribution Models
      </Typography>

      <Typography variant="body2" paragraph sx={{ mt: 1 }}>
        Damiano&nbsp;Righetti&nbsp;et&nbsp;al.&nbsp;
        <em>Global pattern of phytoplankton diversity driven by temperature and
          environmental variability</em>, in <em>Science&nbsp;Advances</em>
        (2019), doi:&nbsp;
        <Link
          href="https://doi.org/10.1126/sciadv.aau6253"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.1126/sciadv.aau6253
        </Link>
        , e-print:&nbsp;
        <Link
          href="https://advances.sciencemag.org/content/5/5/eaau6253.full.pdf"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          Full PDF
        </Link>
        , url:&nbsp;
        <Link
          href="https://advances.sciencemag.org/content/5/5/eaau6253"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          Article Link
        </Link>
      </Typography>

      <Typography variant="body2" paragraph>
        Benedetti&nbsp;et&nbsp;al.&nbsp;<em>Major restructuring of marine
          plankton assemblages under global warming</em>&nbsp;(under&nbsp;review)
        <br />
        Urs&nbsp;Hofmann&nbsp;Elizondo&nbsp;et&nbsp;al.&nbsp;
        <em>Biome partitioning of the global ocean based on phytoplankton
          biogeography</em>, in <em>Progress in Oceanography</em> (2021),
        p.&nbsp;102530,&nbsp;doi:&nbsp;
        <Link
          href="https://doi.org/10.1016/j.pocean.2021.102530"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.1016/j.pocean.2021.102530
        </Link>
        , url:&nbsp;
        <Link
          href="https://www.sciencedirect.com/science/article/pii/S0079661121000203"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          sciencedirect.com/science/article/pii/S0079661121000203
        </Link>
      </Typography>

      {/* CMIP5 */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
        CMIP5
      </Typography>

      <Typography variant="body2" paragraph sx={{ mt: 1 }}>
        Karl&nbsp;E.&nbsp;Taylor,&nbsp;Ronald&nbsp;J.&nbsp;Stouffer&nbsp;and
        Gerald&nbsp;A.&nbsp;Meehl.&nbsp;
        <em>An Overview of CMIP5 and the Experiment Design</em>, in
        <em>Bulletin of the American Meteorological Society</em> (2012),
        pp.&nbsp;485–498,&nbsp;doi:&nbsp;
        <Link
          href="https://doi.org/10.1175/BAMS-D-11-00094.1"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.1175/BAMS-D-11-00094.1
        </Link>
        , url:&nbsp;
        <Link
          href="https://journals.ametsoc.org/view/journals/bams/93/4/bams-d-11-00094.1.xml"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          journals.ametsoc.org/view/journals/bams/93/4/bams-d-11-00094.1.xml
        </Link>
      </Typography>

      {/* Earth System Models */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
        Earth System Models
      </Typography>

      <Typography variant="body2" paragraph sx={{ mt: 1 }}>
        Aurore&nbsp;Voldoire&nbsp;et&nbsp;al.&nbsp;
        <em>The CNRM-CM5.1 global climate model: description and basic
          evaluation</em>, in <em>Climate Dynamics</em> (May&nbsp;2013),
        pp.&nbsp;2091–2121, doi:&nbsp;
        <Link
          href="https://doi.org/10.1007/S00382-011-1259-Y"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.1007/S00382-011-1259-Y
        </Link>
        , url:&nbsp;
        <Link
          href="https://hal.archives-ouvertes.fr/hal-008330"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          hal.archives-ouvertes.fr/hal-008330
        </Link>
      </Typography>

      <Typography variant="body2" paragraph>
        Jean-Louis&nbsp;Dufresne&nbsp;et&nbsp;al.&nbsp;
        <em>Climate change projections using the IPSL-CM5 Earth System Model:
          from CMIP3 to CMIP5</em>, in <em>Climate Dynamics</em> (2013),
        pp.&nbsp;2123–2165,&nbsp;doi:&nbsp;
        <Link
          href="https://doi.org/10.1007/S00382-012-1636-1"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.1007/S00382-012-1636-1
        </Link>
        , url:&nbsp;
        <Link
          href="https://hal.archives-ouvertes.fr/hal-0079"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          hal.archives-ouvertes.fr/hal-0079
        </Link>
      </Typography>

      <Typography variant="body2" paragraph>
        Thomas&nbsp;L.&nbsp;Delworth&nbsp;et&nbsp;al.&nbsp;
        <em>GFDL’s CM2 Global Coupled Climate Models. Part&nbsp;I: Formulation
          and Simulation Characteristics</em>, in <em>Journal of Climate</em>
        (2006), pp.&nbsp;643–674,&nbsp;doi:&nbsp;
        <Link
          href="https://doi.org/10.1175/JCLI3629.1"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          10.1175/JCLI3629.1
        </Link>
        , url:&nbsp;
        <Link
          href="https://journals.ametsoc.org/view/journals/clim/19/5/jcli3629"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'primary.main' }}
        >
          journals.ametsoc.org/view/journals/clim/19/5/jcli3629
        </Link>
      </Typography>

      {/* Acknowledgements */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
        Acknowledgements
      </Typography>
      <Typography variant="body2" paragraph sx={{ mt: 1 }}>
        We acknowledge the World Climate Research Programme’s Working Group on
        Coupled Modelling, which is responsible for CMIP, and we thank the
        climate-modeling groups for producing and making available their model
        output. For CMIP the U.S. Department of Energy’s Program for Climate
        Model Diagnosis and Intercomparison provides coordinating support and
        led development of software infrastructure in partnership with the
        Global Organization for Earth System Science Portals.
      </Typography>
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default ReferencesModal;
