import React, { useState } from 'react';

const Footer = () => {
  const [showReferences, setShowReferences] = useState(false);

  const toggleReferences = () => {
    setShowReferences(!showReferences);
  };

  return (
    <footer className="footer">
      <div className="footer-logo-container">
        <a href="https://up.ethz.ch/research/ongoing-projects.html">
          <img src="/assets/ETH_logo.png" alt="ETH Zurich" className="footer-logo" />
        </a>
        <a href="https://gspi.ch/collaboration_projec/marine-plankton-diversity-bioindicator-scenarios-for-policy-makers-mapmaker/">
          <img src="/assets/GSPI_logo.png" alt="GSPI" className="footer-logo" />
        </a>
        <a href="https://www.iucn.org/theme/marine-and-polar">
          <img src="/assets/IUCN_logo.png" alt="IUCN" className="footer-logo" />
        </a>
        <a href="https://esgf-node.llnl.gov/search/cmip5/">
          <img
            src="/assets/CMIP5_Data_Archive_3.png"
            alt="CMIP5"
            className="footer-logo"
            style={{ width: '140px' }} // Optional override
          />
        </a>
      </div>

      <div>
        <button onClick={toggleReferences} className="footer-text-button">
          References and Data Courtesy
        </button>
      </div>

      {showReferences && (
        <div className="footer-text-container">
          <p><strong>Data</strong></p>

          <p><em>Phytoplankton</em></p>
          <p>
            Damiano Righetti et al. PhytoBase: A global synthesis of open-ocean phytoplankton occurrences,
            In: Earth System Science Data (2020), pp. 907 to 933,
            doi: <a href="https://doi.org/10.5194/essd-12-907-2020" target="_blank" rel="noopener noreferrer">
              10.5194/essd-12-907-2020
            </a>,
            url: <a href="https://essd.copernicus.org/articles/12/907/2020/" target="_blank" rel="noopener noreferrer">
              https://essd.copernicus.org/articles/12/907/2020/
            </a>
          </p>

          <p><em>Zooplankton</em></p>
          <p>
            Benedetti et al. Major restructuring of marine plankton assemblages under global warming (under review)
            <br />
            E. T. Buitenhuis et al. MAREDAT: towards a world atlas of MARine Ecosystem DATa,
            In: Earth System Science Data (July 2013), pp. 227 to 239,
            doi: <a href="https://doi.org/10.5194/essd-5-227-2013" target="_blank" rel="noopener noreferrer">
              10.5194/essd-5-227-2013
            </a>
          </p>

          <p><strong>Species Distribution Models</strong></p>
          <p>
            Damiano Righetti et al. Global pattern of phytoplankton diversity driven by temperature and
            environmental variability, In: Science Advances (2019), doi:
            <a href="https://doi.org/10.1126/sciadv.aau6253" target="_blank" rel="noopener noreferrer">
              10.1126/sciadv.aau6253
            </a>, eprint:
            <a href="https://advances.sciencemag.org/content/5/5/eaau6253.full.pdf" target="_blank" rel="noopener noreferrer">
              Full PDF
            </a>, url:
            <a href="https://advances.sciencemag.org/content/5/5/eaau6253" target="_blank" rel="noopener noreferrer">
              Article Link
            </a>
          </p>
          <p>
            Benedetti et al. Major restructuring of marine plankton assemblages under global warming (under review)
            <br />
            Urs Hofmann Elizondo et al. Biome partitioning of the global ocean based on phytoplankton
            biogeography, In: Progress in Oceanography (2021), p. 102530. issn: 0079 to 6611,
            doi: <a href="https://doi.org/10.1016/j.pocean.2021.102530" target="_blank" rel="noopener noreferrer">
              https://doi.org/10.1016/j.pocean.2021.102530
            </a>,
            url: <a href="https://www.sciencedirect.com/science/article/pii/S0079661121000203" target="_blank" rel="noopener noreferrer">
              Full Article
            </a>
          </p>

          <p><strong>CMIP5</strong></p>
          <p>
            Karl E. Taylor, Ronald J. Stouffer, and Gerald A. Meehl. An Overview of CMIP5 and the Experiment
            Design, In: Bulletin of the American Meteorological Society (2012), pp. 485 to 498, doi:
            <a href="https://doi.org/10.1175/BAMS-D-11-00094.1" target="_blank" rel="noopener noreferrer">
              10.1175/BAMS-D-11-00094.1
            </a>,
            url: <a href="https://journals.ametsoc.org/view/journals/bams/93/4/bams-d-11-00094.1.xml" target="_blank" rel="noopener noreferrer">
              Full Article
            </a>
          </p>

          <p><strong>Earth System Models</strong></p>
          <p>
            Aurore Voldoire et al. The CNRM-CM5.1 global climate model: description and basic evaluation,
            In: Climate Dynamics (May 2013), pp. 2091 to 2121, doi:
            <a href="https://doi.org/10.1007/S00382-011-1259-Y" target="_blank" rel="noopener noreferrer">
              10.1007/S00382-011-1259-Y
            </a>,
            url: <a href="https://hal.archives-ouvertes.fr/hal-008330" target="_blank" rel="noopener noreferrer">
              Full Article
            </a>
          </p>
          <p>
            Jean-Louis Dufresne et al. Climate change projections using the IPSL-CM5 Earth System Model:
            from CMIP3 to CMIP5, In: Climate Dynamics (2013), pp. 2123 to 2165, doi:
            <a href="https://doi.org/10.1007/s00382-012-1636-1" target="_blank" rel="noopener noreferrer">
              10.1007/s00382-012-1636-1
            </a>,
            url: <a href="https://hal.archives-ouvertes.fr/hal-0079" target="_blank" rel="noopener noreferrer">
              Full Article
            </a>
          </p>
          <p>
            Thomas L. Delworth et al. GFDL’s CM2 Global Coupled Climate Models. Part I: Formulation and
            Simulation Characteristics, In: Journal of Climate (2006), pp. 643 to 674, doi:
            <a href="https://doi.org/10.1175/JCLI3629.1" target="_blank" rel="noopener noreferrer">
              10.1175/JCLI3629.1
            </a>,
            url: <a href="https://journals.ametsoc.org/view/journals/clim/19/5/jcli3629" target="_blank" rel="noopener noreferrer">
              Full Article
            </a>
          </p>

          <p><strong>Acknowledgements</strong></p>
          <p>
            We acknowledge the World Climate Research Programme’s Working Group on Coupled Modelling, which
            is responsible for CMIP, and we thank the climate modeling groups for producing and making
            available their model output. For CMIP the U.S. Department of Energy’s Program for Climate Model
            Diagnosis and Intercomparison provides coordinating support and led development of software
            infrastructure in partnership with the Global Organization for Earth System Science Portals.
          </p>
        </div>
      )}
    </footer>
  );
};

export default Footer;