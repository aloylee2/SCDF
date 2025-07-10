<h1>myResponder+ : Advanced Community Role Allocation Engine</h1>

<p><b>Welcome to <i>myResponder+</i></b>, the intelligent coordination layer built on top of SCDF’s myResponder app. Our solution was designed and developed during the SCDF Lifesaver’s Innovation Challenge 2025 by <b>NTUsim Alliance</b>. It harnesses real-time data, user preferences, and machine learning to optimize role assignments for Community First Responders (CFRs), ensuring faster, more organized, and confidence-boosted emergency responses.</p>

<hr />

<h2>Project Overview</h2>

<p>Singapore’s aging population and declining birth rate place increasing pressure on frontline emergency resources. While the existing myResponder app mobilizes trained volunteers, participation barriers—such as fear of causing harm, skill attrition, and communication challenges—limit its effectiveness. <b>myResponder+</b> addresses these gaps by:</p>

<ol>
  <li><b>Dynamic Role Allocation</b> – Assigning context-aware tasks (e.g., AED retrieval, CPR administration, crowd control) based on arrival time, proximity, and user-stated preferences.</li>
  <li><b>Real-Time Task Tracking</b> – Allowing any CFR to update mission-critical information (IC entry, AED status, live video feed) that synchronizes across all responders and the SCDF Ops center.</li>
  <li><b>Inclusive Interface</b> – Auto-detecting device language settings to provide non-native speakers and seniors with translated instructions.</li>
  <li><b>Training Alerts &amp; Muscle Memory</b> – Pushing guided CPR/AED practice sessions in public venues, led by trained NSFs, using the same emergency interface.</li>
  <li><b>Personalized Recognition</b> – Generating AI-driven keepsake images for participating CFRs, fostering pride and encouraging peer sharing.</li>
  <li><b>Machine Learning Optimization</b> – Continuously learning from incident outcomes, travel times, and task successes to refine future role assignments.</li>
</ol>

<hr />

<h2>Key Features &amp; Workflow</h2>

<ol>
  <li><b>Incident Trigger</b> – When an emergency alert is raised, nearby CFRs receive notifications in myResponder+.</li>
  <li><b>Provisional Assignments</b> – The first to acknowledge is tentatively assigned high-priority roles; assignments adjust as other CFRs join.</li>
  <li><b>Task Execution</b> – Assigned CFRs see clear, actionable prompts (e.g., “Locate the nearest AED”). Others can volunteer for supportive tasks.</li>
  <li><b>Continuous Updates</b> – All status changes—IC entry, shock count, victim consciousness—update in real time.</li>
  <li><b>Post-Incident ML Analysis</b> – Data on user performance, task completion, and preferences feed into the ML engine to improve future dispatches.</li>
</ol>

<hr />

<h2>Tech Stack</h2>

<h3>Frontend (React Native)</h3>
<ul>
  <li><b>React Native</b> &mdash; Cross-platform mobile framework</li>
  <li><b>TypeScript</b> &mdash; Statically-typed JS for safer code</li>
  <li><b>react-native-maps</b> &mdash; Map rendering and markers</li>
  <li><b>@react-native-community/geolocation</b> &mdash; Device GPS integration</li>
  <li><b>@gorhom/bottom-sheet</b> &mdash; Modal &amp; non-modal bottom sheets</li>
  <li><b>react-native-gesture-handler</b> &mdash; Touch &amp; gesture support</li>
  <li><b>react-native-reanimated</b> &mdash; High-performance animations</li>
</ul>

<h3>Backend (Flask + Docker)</h3>
<ul>
  <li><b>Python 3.11</b> &mdash; Language runtime</li>
  <li><b>Flask 3.x</b> &mdash; Lightweight web framework</li>
  <li><b>Flask-CORS</b> &mdash; Cross-origin resource sharing</li>
  <li><b>Flask-SQLAlchemy</b> &mdash; ORM for relational data</li>
  <li><b>psycopg2-binary</b> &mdash; PostgreSQL driver</li>
  <li><b>geopy</b> &mdash; Geospatial distance calculations</li>
  <li><b>requests</b> &mdash; HTTP client for external APIs</li>
</ul>

<h3>Database</h3>
<ul>
  <li><b>PostgreSQL 14</b> (Docker) &mdash; Production-grade relational store</li>
  <li><b>Flask-Migrate (Alembic)</b> &mdash; Schema migrations</li>
</ul>

<h3>APIs &amp; Data Sources</h3>
<ul>
  <li><b>data.gov.sg Datastore API</b> &mdash; AED locations dataset</li>
  <li><b>OneMap API</b> &mdash; Postal-to-coordinates geocoding</li>
  <li><b>Google Maps Directions API</b> &mdash; Routing &amp; polylines</li>
</ul>

<h3>DevOps &amp; Environment</h3>
<ul>
  <li><b>Docker Compose</b> &mdash; Service orchestration (<code>Flask</code> + <code>PostgreSQL</code>)</li>
  <li><b>python:3.11-slim</b> &mdash; Official Docker base image for Flask</li>
  <li><b>ESLint + Prettier</b> &mdash; Code linting &amp; formatting</li>
  <li><b>GitHub Actions</b> &mdash; CI/CD pipelines (optional)</li>
</ul>

<h3>Testing</h3>
<ul>
  <li><b>pytest</b> &mdash; Backend unit &amp; integration tests</li>
  <li><b>pytest-flask</b> &mdash; Flask testing utilities</li>
  <li><b>Jest</b> &mdash; Frontend unit tests (components &amp; logic)</li>
  <li><b>React Native Testing Library</b> &mdash; Component rendering &amp; interaction</li>
</ul>

<hr />

<h2>Installation &amp; Setup</h2>
<ol>
  <li><b>Clone the Repository</b><br />
      <code>git clone git@github.com:NTUSIM/DELLSCDFInnovationChallenge2025.git</code>
  </li>
  <li><b>Backend Setup</b><br />
      <code>cd backend<br />python3 -m venv venv &amp;&amp; source venv/bin/activate<br />pip install -r requirements.txt 
    server at http://localhost:5000</code>
  </li>
  <li><b>Mobile App</b><br />
      <code>cd ../mobile<br />npm install<br />npx react-native run-ios  # or run-android</code>
  </li>
</ol>

<hr />

<h2>Team &amp; Acknowledgments</h2>

<ul>
  <li><b>Qays Faaris</b> (Leader)</li>
  <li><b>Aloysius Lee</b> (Full-Stack Engineer)</li>
  <li><b>Huang Kaibao</b> (Full-Stack Engineer)</li>
  <li><b>Sean Er</b> (Full-Stack Engineer)</li>
</ul>

<p>Special thanks to our mentors from Dell Technologies, the mentors from SCDF, and the teams at Dell and SCDF for their guidance and support.</p>

<hr />

<h2>Our First Hackathon Journey</h2>
<p><i>Developed during the SCDF Lifesaver’s Innovation Challenge 2025</i></p>
<p><b>As first-time hackathon participants, we’ve learned, laughed, and pushed our limits together, this journey has been incredibly rewarding, and we can’t wait to see where our newfound passion takes us next!</b></p>