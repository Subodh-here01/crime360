import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Camera, Upload, Search, User, AlertTriangle, CheckCircle, X, Database, Zap, Brain, MapPin } from 'lucide-react';
import { elasticsearchService, FaceRecognitionDocument } from '../services/ElasticsearchService';

export function FacialRecognition() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [matchResults, setMatchResults] = useState<FaceRecognitionDocument[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);
  const [faceFeatures, setFaceFeatures] = useState<number[]>([]);
  const [searchTime, setSearchTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate mock face features from image
  const generateFaceFeatures = (imageData: string): number[] => {
    // In a real implementation, this would use a face recognition library
    // For demo purposes, we'll generate pseudo-random features based on image data
    const features = [];
    for (let i = 0; i < 128; i++) {
      features.push(Math.random() * 2 - 1); // Values between -1 and 1
    }
    return features;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisComplete(false);
        setMatchResults([]);
        setAnalysisProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setMatchResults([]);

    // Simulate AI feature extraction progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 100);

    try {
      // Extract face features (simulated)
      const features = generateFaceFeatures(selectedImage);
      setFaceFeatures(features);
      
      // Search using Elasticsearch
      const threshold = confidenceThreshold[0] / 100;
      const startTime = Date.now();
      const response = await elasticsearchService.searchFaces(features, threshold);
      const endTime = Date.now();
      
      setSearchTime(endTime - startTime);
      setMatchResults(response.hits.hits.map(hit => hit._source));
      setAnalysisProgress(100);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Face recognition analysis failed:', error);
      setMatchResults([]);
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setSelectedImage(null);
    setAnalysisComplete(false);
    setMatchResults([]);
    setAnalysisProgress(0);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Wanted': return 'destructive';
      case 'Convicted': return 'secondary';
      case 'Released': return 'outline';
      default: return 'outline';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Upload Section with Elasticsearch Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI-Powered Facial Recognition</span>
            <Badge variant="secondary" className="ml-2">
              <Database className="w-3 h-3 mr-1" />
              Elasticsearch Vector Search
            </Badge>
          </CardTitle>
          <CardDescription>
            Advanced facial recognition using deep learning and vector similarity search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Confidence Threshold Slider */}
          <div className="space-y-3">
            <Label>Confidence Threshold: {confidenceThreshold[0]}%</Label>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50% (More results)</span>
              <span>100% (Exact matches only)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={startAnalysis}
              disabled={!selectedImage || isAnalyzing}
              className="flex-1"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Processing Face Vector...' : 'Run Vector Search'}
            </Button>
            <Button variant="outline" onClick={clearAnalysis}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Enhanced Analysis Progress */}
          {isAnalyzing && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span>Extracting facial embeddings and searching vectors...</span>
                </div>
                <span className="font-medium">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div className={`flex items-center space-x-1 ${analysisProgress > 30 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${analysisProgress > 30 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Face Detection</span>
                </div>
                <div className={`flex items-center space-x-1 ${analysisProgress > 60 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${analysisProgress > 60 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Feature Extraction</span>
                </div>
                <div className={`flex items-center space-x-1 ${analysisProgress > 85 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${analysisProgress > 85 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Vector Matching</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Elasticsearch Vector Search Results</span>
            </CardTitle>
            <CardDescription>
              Found {matchResults.length} matches in {searchTime}ms using cosine similarity search
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matchResults.length > 0 ? (
              <div className="space-y-4">
                {matchResults.map(match => (
                  <div key={match.id} className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={match.mugshots[0]}
                        alt={match.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{match.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusColor(match.status) as any}>
                              {match.status}
                            </Badge>
                            <Badge variant={getRiskLevelColor(match.riskLevel) as any}>
                              {match.riskLevel} Risk
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><span className="font-medium">ID:</span> {match.personId}</div>
                          <div><span className="font-medium">Last Seen:</span> {match.lastSeen}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Aliases */}
                      {match.aliases.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-600">Known Aliases:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.aliases.map((alias, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {alias}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Charges */}
                      <div>
                        <span className="text-xs font-medium text-gray-600">Charges:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.charges.map((charge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {charge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Physical Description */}
                      {match.metadata && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          {match.metadata.height && (
                            <div><span className="font-medium">Height:</span> {match.metadata.height}</div>
                          )}
                          {match.metadata.weight && (
                            <div><span className="font-medium">Weight:</span> {match.metadata.weight}</div>
                          )}
                        </div>
                      )}

                      {/* Last Known Location */}
                      {match.locations.length > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>Last seen: {match.locations[0].area}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        View in Kibana
                      </Button>
                      <Button size="sm" variant="outline">
                        Update Index
                      </Button>
                      <Button size="sm" variant="destructive">
                        Generate Alert
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                <p className="text-gray-600">
                  No matches found in the criminal database. The person may not be in our records.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>AI Analysis Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>Facial recognition system uses advanced AI algorithms to compare facial features</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>Confidence scores above 85% are considered reliable matches</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>Results should be verified by human analysts before taking action</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p>All searches are logged for audit and compliance purposes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}