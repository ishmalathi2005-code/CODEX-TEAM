const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { analyzeResumeAndGenerateQuestions } = require('../services/aiService');

exports.analyzeResume = asyncHandler(async (req, res) => {
  const { resumeText, targetRole, difficulty, questionCount } = req.body;

  if (!resumeText || !resumeText.trim()) {
    return errorResponse(res, 'Resume text is required for analysis.', 400);
  }

  const analysisResult = await analyzeResumeAndGenerateQuestions(
    resumeText,
    targetRole || 'Full Stack Developer',
    difficulty || 'Medium',
    questionCount || 5
  );

  return successResponse(res, 'Resume analyzed and tailored questions generated successfully.', analysisResult);
});
