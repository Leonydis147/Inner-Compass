interface CoachResponseProps {
  emotion?: string;
  validation?: string;
  insight?: string;
  reflection_question?: string;
  action_step?: string;
  urgency_score?: number;
  crisisResources?: Array<{ name: string; contact: string }>;
}

export default function CoachResponse({
  emotion,
  validation,
  insight,
  reflection_question,
  action_step,
  urgency_score,
  crisisResources,
}: CoachResponseProps) {
  const isCrisis = urgency_score && urgency_score > 0.8;

  return (
    <div className={`mt-8 p-6 rounded-lg space-y-4 ${isCrisis ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'}`}>
      {isCrisis && (
        <div className="mb-4 p-4 bg-red-100 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">Crisis Resources</h3>
          {crisisResources?.map((resource, i) => (
            <p key={i} className="text-red-700">
              <strong>{resource.name}:</strong> {resource.contact}
            </p>
          ))}
        </div>
      )}

      <div>
        <h3 className="font-semibold text-lg">Emotion Detected</h3>
        <p className="text-gray-700">{emotion}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Validation</h3>
        <p className="text-gray-700">{validation}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Insight</h3>
        <p className="text-gray-700">{insight}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Reflection Question</h3>
        <p className="text-gray-700 italic">{reflection_question}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Action Step</h3>
        <p className="text-gray-700">{action_step}</p>
      </div>
    </div>
  );
}
