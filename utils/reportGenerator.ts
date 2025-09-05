

import { AllInputs, Material, Currency, WallInputs, SimpleConcreteInputs, SlabInputs, FoundationInputs, BrickType, ConcreteResistance, GroundingChunk, AIResponse } from '../types';

declare const jspdf: any;

export interface ReportData {
  calculationName: string;
  inputs: AllInputs;
  results: Material[];
  totalCost: number;
  currency: Currency;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  aiResponse?: AIResponse | null;
}

const formatInputsForDisplay = (inputs: AllInputs, t: ReportData['t']): { key: string, value: string }[] => {
    const lines: { key: string, value: string }[] = [];
    const addLine = (key: string, value: any, unit: string = '') => {
        lines.push({key: t(key), value: `${value}${unit ? ` ${unit}`: ''}`});
    }

    if ('area' in inputs && 'brickType' in inputs) { // WallInputs
        const wallInputs = inputs as WallInputs;
        const brickTypeKeyMap: Record<BrickType, string> = {
            [BrickType.RedBrick]: 'brick_type_red_brick',
            [BrickType.LightweightBlock]: 'brick_type_light_block',
            [BrickType.HeavyweightBlock]: 'brick_type_heavy_block'
        };
        addLine('wall_form_area', wallInputs.area, 'm²');
        addLine('wall_form_brick_type', t(brickTypeKeyMap[wallInputs.brickType]));
        addLine('wall_form_joint_horizontal', wallInputs.jointHorizontal, 'm');
        addLine('wall_form_joint_vertical', wallInputs.jointVertical, 'm');
        addLine('wall_form_mortar_ratio', wallInputs.mortarRatio);
        addLine('wall_form_brick_waste', wallInputs.brickWaste, '%');
        addLine('wall_form_mortar_waste', wallInputs.mortarWaste, '%');
    } else if ('volume' in inputs) { // SimpleConcreteInputs
        const concreteInputs = inputs as SimpleConcreteInputs;
         const resistanceKeyMap: Record<ConcreteResistance, string> = {
            [ConcreteResistance.R100]: 'resistance_100',
            [ConcreteResistance.R150]: 'resistance_150',
            [ConcreteResistance.R210]: 'resistance_210',
            [ConcreteResistance.R280]: 'resistance_280'
        };
        addLine('concrete_form_volume', concreteInputs.volume, 'm³');
        addLine('concrete_form_resistance', t(resistanceKeyMap[concreteInputs.resistance]));
        addLine('concrete_form_waste', concreteInputs.concreteWaste, '%');
    } else if ('thickness' in inputs) { // SlabInputs
        const slabInputs = inputs as SlabInputs;
        addLine('slab_form_area', slabInputs.area, 'm²');
        addLine('slab_form_thickness', slabInputs.thickness, 'm');
        addLine('slab_form_joist_width', slabInputs.joistWidth, 'm');
        addLine('slab_form_concrete_waste', slabInputs.concreteWaste, '%');
        addLine('slab_form_steel_waste', slabInputs.steelWaste, '%');
    } else if ('height' in inputs && 'width' in inputs) { // FoundationInputs
        const foundationInputs = inputs as FoundationInputs;
        const resistanceKeyMap: Record<ConcreteResistance, string> = {
            [ConcreteResistance.R100]: 'resistance_100',
            [ConcreteResistance.R150]: 'resistance_150',
            [ConcreteResistance.R210]: 'resistance_210',
            [ConcreteResistance.R280]: 'resistance_280'
        };
        addLine('foundation_form_length', foundationInputs.length, 'm');
        addLine('foundation_form_width', foundationInputs.width, 'm');
        addLine('foundation_form_height', foundationInputs.height, 'm');
        addLine('concrete_form_resistance', t(resistanceKeyMap[foundationInputs.resistance]));
        addLine('foundation_form_stone_percentage', foundationInputs.stonePercentage, '%');
        addLine('concrete_form_waste', foundationInputs.concreteWaste, '%');
    }
    return lines;
}

const escapeCsvCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;

export const downloadCsvReport = (data: ReportData) => {
  const { calculationName, inputs, results, totalCost, currency, t, aiResponse } = data;
  const currencySymbol = currency === Currency.USD ? '$' : 'Mex$';
  const now = new Date();
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  const hasRoundedItems = results.some(r => r.calculatedQuantity !== undefined);

  let csvContent = "";
  
  csvContent += `${escapeCsvCell(t('report_title'))}\n`;
  csvContent += `${escapeCsvCell(t('report_date'))},${escapeCsvCell(timestamp)}\n`;
  csvContent += `${escapeCsvCell(t('report_calculation_type'))},${escapeCsvCell(calculationName)}\n\n`;

  csvContent += `${escapeCsvCell(t('report_input_parameters'))}\n`;
  const formattedInputs = formatInputsForDisplay(inputs, t);
  formattedInputs.forEach(line => {
      csvContent += `${escapeCsvCell(line.key)},${escapeCsvCell(line.value)}\n`;
  });
  csvContent += '\n';

  csvContent += `${escapeCsvCell(t('report_results_summary'))}\n`;
  const headers = [
    t('table_header_material'),
    t('table_header_quantity'),
    t('table_header_unit'),
    `${t('table_header_unit_price')} (${currencySymbol})`,
    `${t('table_header_subtotal')} (${currencySymbol})`,
  ];
  csvContent += headers.map(h => escapeCsvCell(h)).join(',') + '\n';

  results.forEach(material => {
    const quantityDisplay = material.calculatedQuantity !== undefined
      ? `${material.calculatedQuantity.toFixed(2)} -> ${material.quantity.toFixed(2)}`
      : material.quantity.toFixed(2);
    const row = [
      material.name,
      quantityDisplay,
      material.unit,
      material.price.toFixed(2),
      material.subtotal.toFixed(2),
    ];
    csvContent += row.map(cell => escapeCsvCell(cell)).join(',') + '\n';
  });
  
  csvContent += '\n';

  const totalRow = ['', '', '', escapeCsvCell(t('total_estimated_cost')), escapeCsvCell(totalCost.toFixed(2))];
  csvContent += totalRow.join(',') + '\n';

  if (hasRoundedItems) {
      csvContent += `\n,${escapeCsvCell(`* ${t('rounding_footnote')}`)}\n`;
  }
  
  if (aiResponse) {
      csvContent += `\n${escapeCsvCell(t('ai_assistant_title'))}\n`;
      if(aiResponse.analysis) {
        csvContent += `${escapeCsvCell(t('ai_assistant_analysis_title'))}\n`;
        aiResponse.analysis.forEach(insight => {
            csvContent += `${escapeCsvCell(`[${insight.type.toUpperCase()}] ${insight.title}`)},${escapeCsvCell(insight.description)}\n`;
        });
        csvContent += '\n';
      }
      if(aiResponse.stores) {
        csvContent += `${escapeCsvCell(t('ai_assistant_stores_title'))}\n`;
        aiResponse.stores.forEach(store => {
            csvContent += `${escapeCsvCell(store.name)},${escapeCsvCell(store.address)}\n`;
            csvContent += `,"${escapeCsvCell(store.reason)}"\n`;
        });
        csvContent += '\n';
      }
       if(aiResponse.prices) {
        csvContent += `${escapeCsvCell(t('ai_assistant_prices_title'))}\n`;
        aiResponse.prices.forEach(price => {
            csvContent += `${escapeCsvCell(price.materialName)},${escapeCsvCell(`${price.priceRange} ${price.currency}`)}\n`;
        });
        csvContent += '\n';
      }
      if (aiResponse.sources && aiResponse.sources.length > 0) {
          csvContent += `${escapeCsvCell(t('ai_assistant_sources_title'))}\n`;
          aiResponse.sources.forEach(source => {
              csvContent += `${escapeCsvCell(source.web.title || '')},${escapeCsvCell(source.web.uri)}\n`;
          });
      }
  }

  csvContent += `\n\n${escapeCsvCell(t('disclaimer_title'))},${escapeCsvCell(t('disclaimer_text'))}\n`;

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const fileName = `QuantifyEasy_Report_${calculationName.replace(/\s/g, '_')}.csv`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


export const downloadPdfReport = (data: ReportData) => {
    const { calculationName, inputs, results, totalCost, currency, t, aiResponse } = data;
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    const currencySymbol = currency === Currency.USD ? '$' : 'Mex$';
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    const fileName = `QuantifyEasy_Report_${calculationName.replace(/\s/g, '_')}.pdf`;
    const hasRoundedItems = results.some(r => r.calculatedQuantity !== undefined);

    // --- Helper function for text wrapping ---
    const addWrappedText = (text: string, x: number, y: number, options: { maxWidth: number, color?: number[], fontStyle?: string }) => {
        if(options.color) doc.setTextColor(...options.color);
        if(options.fontStyle) doc.setFont(undefined, options.fontStyle);

        const lines = doc.splitTextToSize(text, options.maxWidth);
        doc.text(lines, x, y);

        doc.setFont(undefined, 'normal'); // Reset font style
        doc.setTextColor(100); // Reset color
        return y + lines.length * 5; // Return new Y position
    }


    // Title
    doc.setFontSize(18);
    doc.text(t('report_title'), 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`${t('report_calculation_type')}: ${calculationName}`, 14, 30);
    doc.text(`${t('report_date')}: ${timestamp}`, 14, 36);

    // Input Parameters
    const formattedInputs = formatInputsForDisplay(inputs, t);
    doc.autoTable({
        startY: 45,
        head: [[t('report_input_parameters'), '']],
        body: formattedInputs.map(line => [line.key, line.value]),
        theme: 'striped',
        headStyles: { fillColor: [211, 112, 154] },
    });

    let finalY = doc.lastAutoTable.finalY;

    // Results Table
    const resultsBody: any[] = results.map(material => {
        const quantityDisplay = material.calculatedQuantity !== undefined
            ? `${material.calculatedQuantity.toFixed(2)} -> ${material.quantity.toFixed(2)}`
            : material.quantity.toFixed(2);
        return [
            material.name,
            `${quantityDisplay} ${material.unit}`,
            material.price.toFixed(2),
            material.subtotal.toFixed(2),
        ];
    });

    resultsBody.push([
        { content: t('total_estimated_cost'), colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `${currencySymbol}${totalCost.toFixed(2)}`, styles: { fontStyle: 'bold' } },
    ]);
    
    doc.autoTable({
        startY: finalY + 10,
        head: [[
            t('table_header_material'),
            t('table_header_quantity'),
            `${t('table_header_unit_price')} (${currencySymbol})`,
            `${t('table_header_subtotal')} (${currencySymbol})`,
        ]],
        body: resultsBody,
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80] },
    });

    finalY = doc.lastAutoTable.finalY;
    
    // AI Section
    if (aiResponse) {
        finalY += 10;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text(t('ai_assistant_title'), 14, finalY);
        finalY += 6;

        if (aiResponse.analysis) {
            doc.setFontSize(12);
            doc.text(t('ai_assistant_analysis_title'), 14, finalY);
            finalY += 6;
            aiResponse.analysis.forEach(insight => {
                finalY = addWrappedText(`[${insight.type.toUpperCase()}] ${insight.title}`, 16, finalY, {maxWidth: 180, fontStyle: 'bold'});
                finalY = addWrappedText(insight.description, 16, finalY, {maxWidth: 180}) + 2;
            });
        }
        if (aiResponse.stores) {
             doc.setFontSize(12);
             doc.text(t('ai_assistant_stores_title'), 14, finalY);
             finalY += 6;
             aiResponse.stores.forEach(store => {
                finalY = addWrappedText(store.name, 16, finalY, {maxWidth: 180, fontStyle: 'bold'});
                finalY = addWrappedText(store.address, 16, finalY, {maxWidth: 180, color: [120,120,120]});
                finalY = addWrappedText(store.reason, 16, finalY, {maxWidth: 180}) + 2;
             });
        }
        if (aiResponse.prices) {
             doc.setFontSize(12);
             doc.text(t('ai_assistant_prices_title'), 14, finalY);
             finalY += 2;
             doc.autoTable({
                startY: finalY,
                head: [[t('table_header_material'), 'Price']],
                body: aiResponse.prices.map(p => [p.materialName, `${p.priceRange} ${p.currency}`]),
                theme: 'grid'
             });
             finalY = doc.lastAutoTable.finalY;
        }

        if (aiResponse.sources && aiResponse.sources.length > 0) {
            finalY += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(t('ai_assistant_sources_title'), 14, finalY);
            finalY += 5;
            doc.setFont(undefined, 'normal');
            doc.setTextColor(74, 114, 226); // Link blue
            aiResponse.sources.forEach(source => {
                doc.textWithLink(source.web.title || source.web.uri, 14, finalY, { url: source.web.uri });
                finalY += 5;
            });
        }
    }


    if (hasRoundedItems) {
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`* ${t('rounding_footnote')}`, 14, finalY + 8);
        finalY += 8;
    }

    // Disclaimer
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont(undefined, 'bold');
    doc.text(`${t('disclaimer_title')}:`, 14, finalY + 8);
    doc.setFont(undefined, 'normal');
    const disclaimerLines = doc.splitTextToSize(t('disclaimer_text'), 180);
    doc.text(disclaimerLines, 14, finalY + 12);


    doc.save(fileName);
};