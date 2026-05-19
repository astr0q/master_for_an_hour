import { useEffect, useState } from 'react';
import { getRequests, getReviews, submitReview } from '../services/api';
import { useAuth } from '../context/authContext';
import Spinner from '../components/spinner';
import PageWrapper from '../components/pageWrapper';

export default function MyRequests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
  new: '#22C55E',
  assigned: '#cba6f7',
  in_progress: '#f9e2af',
  completed: '#a6e3a1',
  cancelled: '#f38ba8',
  };

  const [reviews, setReviews] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewMsg, setReviewMsg] = useState({});

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await getRequests('customer', user.profile_id);
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    getReviews().then(res => {
      const map = {};
      res.data.forEach(r => { map[r.request_id] = r; });
      setReviews(map);
    });
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <Spinner />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div>
        <h2 style={{color:'#888'}}>My Requests</h2>

        {requests.length === 0 && <p>No requests yet.</p>}

        {requests.map(r => (
          <div key={r.request_id} style={styles.card}>
            <strong>{r.service_name}</strong>

            <span
              style={{
                ...styles.badge,
                backgroundColor: statusColors[r.status] || '#ccc'
              }}
            >
              {r.status}
            </span>

            <p>{r.address}</p>
            <p>{r.description}</p>

            {r.assigned_master_name && (
              <p>Master: {r.assigned_master_name}</p>
            )}

            <small>
              {new Date(r.created_at).toLocaleString()}
            </small>

            {r.status === 'completed' && (
              <div style={styles.reviewBox}>
                {reviews[r.request_id] ? (
                  <div>
                    <span style={styles.stars}>
                      {'★'.repeat(reviews[r.request_id].rating)}
                      {'☆'.repeat(5 - reviews[r.request_id].rating)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
                      {reviews[r.request_id].comment || 'No comment'}
                    </span>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                      Rate this job:
                    </p>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          onClick={() => setReviewInputs(prev => ({
                            ...prev,
                            [r.request_id]: { ...prev[r.request_id], rating: star }
                          }))}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '22px',
                            cursor: 'pointer',
                            color: (reviewInputs[r.request_id]?.rating || 0) >= star ? '#f9e2af' : '#ccc',
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <input
                      placeholder="Leave a comment (optional)"
                      value={reviewInputs[r.request_id]?.comment || ''}
                      onChange={e => setReviewInputs(prev => ({
                        ...prev,
                        [r.request_id]: { ...prev[r.request_id], comment: e.target.value }
                      }))}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #374151', fontSize: '13px', marginBottom: '8px' }}
                    />
                    <button
                      onClick={async () => {
                        const input = reviewInputs[r.request_id];
                        if (!input?.rating) return;
                        try {
                          await submitReview({
                            request_id: r.request_id,
                            customer_id: user.profile_id,
                            rating: input.rating,
                            comment: input.comment || '',
                          });
                          setReviewMsg(prev => ({ ...prev, [r.request_id]: 'Review submitted!' }));
                          getReviews().then(res => {
                            const map = {};
                            res.data.forEach(rv => { map[rv.request_id] = rv; });
                            setReviews(map);
                          });
                        } catch (err) {
                          setReviewMsg(prev => ({ ...prev, [r.request_id]: err.response?.data?.error || 'Failed' }));
                        }
                      }}
                      style={styles.reviewBtn}
                    >
                      Submit Review
                    </button>
                    {reviewMsg[r.request_id] && (
                      <p style={{ fontSize: '12px', color: 'green', marginTop: '4px' }}>
                        {reviewMsg[r.request_id]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
        ))}
      </div>
    </PageWrapper>
  );
}

const styles = {
  card: {
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
  },
  badge: {
    marginLeft: '10px',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  reviewBox: {
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid #374151',
  },
  stars: {
    fontSize: '18px',
    color: '#f9e2af',
  },
  reviewBtn: {
    backgroundColor: '#22C55E',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
};
