import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard"; // Repo mein already hoga
import PageLoader from "../components/PageLoader";

const FriendsPage = () => {
  // useQuery logic: fetches data and provides loading state
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"], // Unique ID in RAM
    queryFn: getUserFriends,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 h-full bg-base-100 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Language Partners ({friends?.length || 0})
      </h1>

      {friends?.length === 0 ? (
        <div className="text-center py-20 opacity-60">
          No friends yet. Add some from Home!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
