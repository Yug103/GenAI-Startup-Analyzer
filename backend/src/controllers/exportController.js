import PDFDocument from 'pdfkit';
import StartupReport from '../models/StartupReport.js';

// @desc    Export report as PDF
// @route   GET /api/export/pdf/:id
// @access  Private
const exportPdf = async (req, res, next) => {
  try {
    const report = await StartupReport.findById(req.params.id);

    if (!report || report.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Report not found');
    }

    const doc = new PDFDocument();
    
    let filename = encodeURIComponent(report.name) + '_Report.pdf';
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    
    doc.pipe(res);
    
    // PDF Content
    doc.fontSize(25).text(`Startup Analysis: ${report.name}`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).text(`Overall Score: ${report.scores.overall}/100`);
    doc.text(`Recommendation: ${report.recommendation}`);
    doc.moveDown();

    doc.fontSize(14).text('Problem Statement:', { underline: true });
    doc.fontSize(12).text(report.problem);
    doc.moveDown();

    doc.fontSize(14).text('SWOT Analysis', { underline: true });
    doc.fontSize(12).text('Strengths:');
    report.swot.strengths.forEach(s => doc.text(`- ${s}`));
    doc.moveDown();

    doc.text('Weaknesses:');
    report.swot.weaknesses.forEach(w => doc.text(`- ${w}`));
    doc.moveDown();

    doc.text('Opportunities:');
    report.swot.opportunities.forEach(o => doc.text(`- ${o}`));
    doc.moveDown();

    doc.text('Threats:');
    report.swot.threats.forEach(t => doc.text(`- ${t}`));

    doc.end();
  } catch (error) {
    next(error);
  }
};

export { exportPdf };
