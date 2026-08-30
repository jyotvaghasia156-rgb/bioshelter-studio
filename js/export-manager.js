/**
 * BioShelter Studio - Export Manager & Bill of Materials (BOM) Generator
 */

import { STRUCTURE_TYPES, GLAZING_MATERIALS, BIOMES, SPECIES_DATABASE } from './ecosystem-data.js';

export class ExportManager {
  constructor(stateStore) {
    this.store = stateStore;
  }

  // UI-10: Currency symbol helper
  getCurrencySymbol() {
    const map = { USD: '$', INR: '₹', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$' };
    return map[this.store.getState().currency] || '$';
  }
  generateBOM() {
    const state = this.store.getState();
    const metrics = this.store.getCalculatedMetrics();
    const structure = STRUCTURE_TYPES[state.structureType] || STRUCTURE_TYPES.geodesic;
    const glazing = GLAZING_MATERIALS[state.glazingType] || GLAZING_MATERIALS.etfe_triple;

    const items = [];

    // 1. Structure & Framing
    const strutCount = Math.round(metrics.envelopeArea * 1.8);
    items.push({
      category: 'Structure & Framing',
      item: `${structure.name} Engineered Timber / Strut Frame`,
      quantity: `${strutCount} units`,
      unitPrice: 28,
      totalPrice: strutCount * 28,
      notes: 'Pressure-treated douglas fir / anodized structural aluminum hubs'
    });

    const foundationConcreteM3 = Math.round((Math.PI * state.diameter * 0.3 * 0.4) * 10) / 10;
    items.push({
      category: 'Structure & Framing',
      item: 'Insulated Stem Wall Foundation Ring',
      quantity: `${foundationConcreteM3} m³`,
      unitPrice: 240,
      totalPrice: foundationConcreteM3 * 240,
      notes: 'R-20 XPS perimeter under-slab insulation + fiber-reinforced concrete'
    });

    // 2. Glazing & Envelope
    const glazedArea = Math.round(metrics.envelopeArea * state.glazingRatio);
    items.push({
      category: 'Envelope & Glazing',
      item: glazing.name,
      quantity: `${glazedArea} m²`,
      unitPrice: glazing.costPerSqm,
      totalPrice: glazedArea * glazing.costPerSqm,
      notes: `U-Value: ${glazing.uValue} W/m²K, Light Transmission: ${Math.round(glazing.lightTransmittance * 100)}%`
    });

    const insulatedBermArea = Math.round(metrics.envelopeArea * (1 - state.glazingRatio));
    items.push({
      category: 'Envelope & Glazing',
      item: 'R-35 Cellulose / Wool Berm Wall System',
      quantity: `${insulatedBermArea} m²`,
      unitPrice: 48,
      totalPrice: insulatedBermArea * 48,
      notes: 'Vapor-permeable airtight membrane with heavy earthen berming'
    });

    // 3. Thermal Mass & Climate Battery
    const drumCount = Math.round(state.thermalMassLiters / 208); // 208L = 55 gal drum
    items.push({
      category: 'Thermal Storage',
      item: 'Food-Grade 208L Thermal Mass Water Drums',
      quantity: `${drumCount} drums`,
      unitPrice: 45,
      totalPrice: drumCount * 45,
      notes: 'Painted matte carbon black for maximum radiative heat absorption'
    });

    items.push({
      category: 'Thermal Storage',
      item: 'Subterranean GAHT Earth Tube Loop & Fan',
      quantity: `${state.gahtPipeLengthM} meters`,
      unitPrice: 18,
      totalPrice: state.gahtPipeLengthM * 18 + 550, // pipes + variable EC blower
      notes: '200mm corrugated HDPE perforated drainage tubing + 650 CFM fan'
    });

    // 4. Aquaponics & Hydroponics
    items.push({
      category: 'Aquaculture & Hydroponics',
      item: 'HDPE Aquaculture Tank & Swirl Solids Separator',
      quantity: `${state.aquaponicsVolumeM3} m³ system`,
      unitPrice: 420,
      totalPrice: state.aquaponicsVolumeM3 * 420,
      notes: 'Includes biological moving-bed biofilm filter and aerator ring'
    });

    items.push({
      category: 'Aquaculture & Hydroponics',
      item: 'Expanded Clay Media Beds & DWC Rafts',
      quantity: `${state.hydroponicBedAreaM2} m²`,
      unitPrice: 65,
      totalPrice: state.hydroponicBedAreaM2 * 65,
      notes: 'High-density closed-cell EPS rafts + food-grade expanded clay pebble substrate'
    });

    // 5. Solar Off-Grid Power & Storage
    const panelCount = Math.ceil((state.solarPvKw * 1000) / 450);
    items.push({
      category: 'Energy & Electrical',
      item: '450W Bifacial Monocrystalline Solar PV Array',
      quantity: `${panelCount} panels (${state.solarPvKw} kW)`,
      unitPrice: 185,
      totalPrice: panelCount * 185,
      notes: 'Tier 1 high-efficiency modules with integrated microinverter/MPPT'
    });

    items.push({
      category: 'Energy & Electrical',
      item: 'LiFePO4 Lithium Iron Phosphate Battery Pack',
      quantity: `${state.batteryKwh} kWh`,
      unitPrice: 380,
      totalPrice: state.batteryKwh * 380,
      notes: '6000+ cycle life, built-in smart BMS and low-temperature freeze protection'
    });

    // 6. Rainwater Harvesting & Sensors
    items.push({
      category: 'Hydrology & Controls',
      item: 'Rainwater Catchment Gutters & Underground Cistern',
      quantity: `${state.cisternVolumeLiters} Liters`,
      unitPrice: 0.16,
      totalPrice: Math.round(state.cisternVolumeLiters * 0.16),
      notes: 'Includes first-flush diverter, 100-micron sediment filter, and silent booster pump'
    });

    items.push({
      category: 'Hydrology & Controls',
      item: 'IoT Microclimate Sensor & Automation Hub',
      quantity: '1 complete suite',
      unitPrice: 850,
      totalPrice: 850,
      notes: 'PAR light, VPD humidity, dissolved oxygen, CO2, and automated ridge vent actuators'
    });

    // 7. Biological Living Stock
    const speciesCount = state.activeSpecies.length;
    items.push({
      category: 'Biological Stock',
      item: 'Fingerlings, Mushroom Spawn, Beneficials & Seeds',
      quantity: `${speciesCount} species packages`,
      unitPrice: 65,
      totalPrice: speciesCount * 65,
      notes: 'Certified organic seed varieties, tilapia/trout starter stock, Eisenia fetida worms'
    });

    const grandTotal = items.reduce((acc, it) => acc + it.totalPrice, 0);
    const sym = this.getCurrencySymbol(); // UI-10 FIX: respect currency setting

    return {
      items,
      grandTotal: Math.round(grandTotal),
      costPerSqm: Math.round(grandTotal / Math.max(1, metrics.floorArea)),
      currencySymbol: sym
    };
  }

  exportProjectJson() {
    const state = this.store.getState();
    const metrics = this.store.getCalculatedMetrics();
    const bom = this.generateBOM();

    const projectData = {
      app: 'BioShelter Studio',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      state,
      metrics,
      bomGrandTotal: bom.grandTotal
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.projectName.toLowerCase().replace(/\s+/g, '_')}_bioshelter_spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportCSV() {
    const bom = this.generateBOM();
    let csv = 'Category,Item,Quantity,Unit Price ($),Total Price ($),Technical Notes\n';
    bom.items.forEach(it => {
      csv += `"${it.category}","${it.item}","${it.quantity}",${it.unitPrice},${it.totalPrice},"${it.notes}"\n`;
    });
    csv += `\n"TOTAL","Grand Total Estimate","","","${bom.grandTotal}",""\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bioshelter_bom_schedule.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  printEngineeringReport() {
    // BUG-04 FIX: Apply print-mode class so @media print CSS can style a clean output;
    // this hides the 3D viewport, sidebar, and nav, showing only the BOM table.
    document.body.classList.add('print-mode');
    window.print();
    // Remove class after the print dialog is dismissed
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('print-mode');
    }, { once: true });
    // Fallback: also remove after a timeout in case afterprint doesn't fire
    setTimeout(() => document.body.classList.remove('print-mode'), 3000);
  }
}
