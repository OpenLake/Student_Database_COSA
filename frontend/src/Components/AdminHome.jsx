import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarCheck, 
  MessageSquareText,
  ClipboardList, 
  User, 
  Search,
  Home,
  Clock,
  PlusCircle,
  ChevronDown,
  ListChecks
} from "lucide-react";

export default function AdminHome() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = {
    name: "Amit Sharma",
    rollNumber: "87654321",
    email: "amit.sharma@iitbhilai.ac.in",
    department: "CSE",
    role: "Administrator"
  };

  const createOptions = [
    {
      icon: CalendarCheck,
      title: "Add Event",
      path: "/add-event"
    },
    {
      icon: ClipboardList,
      title: "COSA Create",
      path: "/cosa/create"
    }
  ];

  const quickActions = [
    {
      icon: ListChecks,
      title: "See Events",
      color: "bg-blue-100 text-blue-700",
      onClick: () => navigate("/events")
    },
    {
      icon: CalendarCheck,
      title: "Create Event",
      color: "bg-emerald-100 text-emerald-700",
      onClick: () => navigate("/add-event")
    },
    {
      icon: Clock,
      title: "Create Tenure",
      color: "bg-violet-100 text-violet-700",
      onClick: () => navigate("/cosa/tenure")
    },
    {
      icon: ClipboardList,
      title: "COSA",
      color: "bg-amber-100 text-amber-700",
      onClick: () => navigate("/cosa")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-indigo-700">Admin Dashboard</h1>
          
          <nav className="flex items-center space-x-4">
            <a 
              href="/" 
              className="text-gray-600 hover:text-indigo-700 flex items-center transition text-sm"
            >
              <Home className="mr-1" size={16} />
              Login
            </a>
            <a 
              href="/events" 
              className="text-gray-600 hover:text-indigo-700 flex items-center transition text-sm"
            >
              <CalendarCheck className="mr-1" size={16} />
              Events
            </a>
            <a 
              href="/cosa" 
              className="text-gray-600 hover:text-indigo-700 flex items-center transition text-sm"
            >
              <ClipboardList className="mr-1" size={16} />
              COSA
            </a>
            <a 
              href="/feedback" 
              className="text-gray-600 hover:text-indigo-700 flex items-center transition text-sm"
            >
              <MessageSquareText className="mr-1" size={16} />
              Feedback
            </a>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-600 hover:text-indigo-700 transition text-sm"
              >
                <PlusCircle className="mr-2" size={16} />
                Create
                <ChevronDown 
                  className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  size={16} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-20 w-64 mt-3 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {createOptions.map((option) => (
                    <a
                      key={option.path}
                      href={option.path}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <option.icon 
                        className="mr-3 text-indigo-500 group-hover:text-indigo-700 transition" 
                        size={20} 
                      />
                      <span className="text-gray-800 group-hover:text-indigo-700 transition">
                        {option.title}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-3 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-indigo-700" size={40} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.department}</p>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-600 mr-2">Roll Number:</span>
                <span className="text-gray-800">{user.rollNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 mr-2">Role:</span>
                <span className="text-gray-800">{user.role}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 mr-2">Email:</span>
                <span className="text-gray-800 truncate">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <div 
                  key={index} 
                  onClick={action.onClick}
                  className="group cursor-pointer"
                >
                  <div className={`${action.color} rounded-lg p-4 text-center transition-all duration-300 ease-in-out transform group-hover:-translate-y-2 group-hover:shadow-lg`}>
                    <action.icon className="mx-auto mb-3" size={32} />
                    <h4 className="font-semibold">{action.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}