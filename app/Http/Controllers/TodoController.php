<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TodoController extends Controller
{
    use AuthorizesRequests;

    /**
     * Menampilkan daftar todos dengan pagination
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Todo::where('user_id', $user->id);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('filter')) {
            $filter = $request->input('filter');
            if ($filter === 'finished') {
                $query->where('is_finished', true);
            } elseif ($filter === 'unfinished') {
                $query->where('is_finished', false);
            }
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $todos = $query->paginate(20);

        $stats = [
            'total' => Todo::where('user_id', $user->id)->count(),
            'finished' => Todo::where('user_id', $user->id)->where('is_finished', true)->count(),
            'unfinished' => Todo::where('user_id', $user->id)->where('is_finished', false)->count(),
        ];

        return Inertia::render('app/TodosPage', [
            'todos' => $todos,
            'stats' => $stats,
            'filters' => [
                'search' => $request->input('search', ''),
                'filter' => $request->input('filter', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Tampilkan form untuk membuat todo baru
     */
    public function create()
    {
        return Inertia::render('app/CreateTodoPage');
    }

    /**
     * Menyimpan todo baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['user_id'] = Auth::id();

        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('todos', 'public');
        }

        Todo::create($validated);

        return redirect()->route('todos.index')->with('success', 'Todo berhasil dibuat!');
    }

    /**
     * Tampilkan form untuk edit todo
     */
    public function edit(Todo $todo)
    {
        $this->authorize('update', $todo);

        return Inertia::render('app/EditTodoPage', [
            'todo' => $todo,
        ]);
    }

    /**
     * Update todo
     */
    public function update(Request $request, Todo $todo)
{
    // Cek apakah user punya akses (bukan via authorize, tapi direct check)
    if ($todo->user_id !== auth()->id()) {
        abort(403, 'Unauthorized');
    }

    $validated = $request->validate([
        'title' => 'required|string|max:100',
        'description' => 'nullable|string',
        'is_finished' => 'nullable|boolean',
        'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($request->hasFile('cover')) {
        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }
        $validated['cover'] = $request->file('cover')->store('todos', 'public');
    }

    $todo->update($validated);

    return redirect()->route('todos.index')->with('success', 'Todo berhasil diperbarui!');
}
    /**
     * Hapus todo
     */
    public function destroy(Todo $todo)
    {
        $this->authorize('delete', $todo);

        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }

        $todo->delete();

        return redirect()->route('todos.index')->with('success', 'Todo berhasil dihapus!');
    }

    /**
     * Toggle status todo
     */
    public function toggleStatus(Todo $todo)
    {
        $this->authorize('update', $todo);

        $todo->update([
            'is_finished' => !$todo->is_finished,
        ]);

        return back()->with('success', 'Status todo berhasil diperbarui!');
    }
}